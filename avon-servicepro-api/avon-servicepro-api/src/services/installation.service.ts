import { installationRequestRepository, InstallationRequestEntity } from '../repositories/installationRequest.repository';
import { installationAssignmentRepository, InstallationAssignmentEntity } from '../repositories/installationAssignment.repository';
import { installationRepository, InstallationEntity } from '../repositories/installation.repository';
import { jobRepository, JobEntity } from '../repositories/job.repository';
import { assetRepository } from '../repositories/asset.repository';
import { auditRepository } from '../repositories/audit.repository';
import { dbPool } from '../config/database';
import { logger } from '../config/logger';
import { BadRequestError, NotFoundError } from '../utils/apiError';
import { v4 as uuidv4 } from 'uuid';

export class InstallationService {
  async createRequest(
    reqData: Omit<InstallationRequestEntity, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<InstallationRequestEntity> {
    logger.info(`InstallationService: Creating installation request for serial ${reqData.serialNumber}`);

    // Check if request with serial already exists
    const existing = await installationRequestRepository.findBySerialNumber(reqData.serialNumber);
    if (existing) {
      throw new BadRequestError(`An installation request for serial number ${reqData.serialNumber} already exists`);
    }

    const request = await installationRequestRepository.create({
      ...reqData,
      status: 'Pending Assignment'
    });

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action: 'CREATE_INSTALLATION_REQUEST',
      newValue: request.id,
      remarks: `Created installation request for customer ${request.customerName}, serial ${request.serialNumber}`
    });

    return request;
  }

  async listRequests(options?: any): Promise<{ data: InstallationRequestEntity[]; total: number }> {
    return installationRequestRepository.findAll(options);
  }

  async getRequestDetails(id: string): Promise<InstallationRequestEntity> {
    const request = await installationRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundError(`Installation request with ID ${id} not found`);
    }
    return request;
  }

  async updateRequest(id: string, updates: Partial<InstallationRequestEntity>, userId: string, userName: string, userRole: string): Promise<InstallationRequestEntity> {
    logger.info(`InstallationService: Updating installation request ${id}`);
    const updated = await installationRequestRepository.update(id, updates);

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action: 'UPDATE_INSTALLATION_REQUEST',
      newValue: id,
      remarks: `Updated installation request ${id}`
    });

    return updated;
  }

  async deleteRequest(id: string, userId: string, userName: string, userRole: string): Promise<boolean> {
    logger.info(`InstallationService: Deleting installation request ${id}`);
    await installationRequestRepository.delete(id);

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action: 'DELETE_INSTALLATION_REQUEST',
      newValue: id,
      remarks: `Deleted installation request ${id}`
    });

    return true;
  }

  // Assignment logic
  async assignInstallation(
    requestId: string,
    assignmentData: Omit<InstallationAssignmentEntity, 'id' | 'requestId' | 'createdAt' | 'updatedAt' | 'assignedBy'>,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<InstallationAssignmentEntity> {
    logger.info(`InstallationService: Assigning installation request ${requestId} to ${assignmentData.assignedEngineer}`);

    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Fetch and verify request
      const request = await installationRequestRepository.findById(requestId);
      if (!request) {
        throw new NotFoundError(`Installation request with ID ${requestId} not found`);
      }

      // 2. Update request status
      const updatedRequest = await installationRequestRepository.update(requestId, {
        status: 'Assigned'
      });

      // 3. Create or Update assignment
      let assignment = await installationAssignmentRepository.findByRequestId(requestId);
      const nowStr = new Date().toISOString();

      if (assignment) {
        assignment = await installationAssignmentRepository.update(assignment.id, {
          assignedEngineer: assignmentData.assignedEngineer,
          assignedTechnicians: assignmentData.assignedTechnicians,
          targetInstallationDate: assignmentData.targetInstallationDate,
          priority: assignmentData.priority,
          slaDaysSetting: assignmentData.slaDaysSetting,
          slaDueDate: assignmentData.slaDueDate,
          installationTerritory: assignmentData.installationTerritory,
          remarks: assignmentData.remarks
        });
      } else {
        assignment = await installationAssignmentRepository.create({
          requestId,
          assignedEngineer: assignmentData.assignedEngineer,
          assignedTechnicians: assignmentData.assignedTechnicians,
          assignedBy: userName,
          assignmentDate: nowStr.split('T')[0],
          targetInstallationDate: assignmentData.targetInstallationDate,
          priority: assignmentData.priority,
          slaDaysSetting: assignmentData.slaDaysSetting,
          slaDueDate: assignmentData.slaDueDate,
          installationTerritory: assignmentData.installationTerritory,
          remarks: assignmentData.remarks
        });
      }

      // 4. Create assignment audit log
      await installationAssignmentRepository.createAuditLog({
        requestId,
        assignmentId: assignment.id,
        action: 'ASSIGN_INSTALLATION',
        fromStatus: request.status,
        toStatus: 'Assigned',
        performedBy: userName,
        performedByRole: userRole,
        notes: `Assigned lead engineer ${assignmentData.assignedEngineer}. Target date: ${assignmentData.targetInstallationDate}`
      });

      // 5. Create or Update Service Job Ticket
      const allJobs = await jobRepository.findAll({ limit: 1000 });
      const existingJob = allJobs.data.find(
        j => j.serialNumber === request.serialNumber && j.jobType === 'Installation'
      );

      const timelineStep = {
        status: 'Assigned',
        updatedAt: nowStr,
        updatedBy: userName,
        remarks: `Automatically created from Installation Request & Assignment. Lead: ${assignmentData.assignedEngineer}`
      };

      if (!existingJob) {
        const installationData = {
          invoiceNumber: request.invoiceNumber,
          invoiceValue: request.invoiceValue,
          model: request.model,
          itemDescription: request.instrumentName,
          brand: request.brand,
          customerName: request.customerName,
          warrantyPeriodYears: request.warrantyUnit === 'Years' ? request.warrantyPeriod : 0,
          warrantyPeriodMonths: request.warrantyUnit === 'Months' ? request.warrantyPeriod : request.warrantyUnit === 'Years' ? request.warrantyPeriod * 12 : 12,
          workflowStatus: 'Assigned',
          assignedEngineer: assignmentData.assignedEngineer,
          assignedTechnicians: assignmentData.assignedTechnicians,
          targetInstallationDate: assignmentData.targetInstallationDate,
          priority: assignmentData.priority,
          slaDueDate: assignmentData.slaDueDate,
          installationTerritory: assignmentData.installationTerritory
        };

        await jobRepository.create({
          jobType: 'Installation',
          status: 'Assigned',
          priority: assignmentData.priority === 'Critical' ? 'Emergency' : assignmentData.priority === 'Urgent' ? 'Urgent' : 'Routine',
          customerName: request.customerName,
          brand: request.brand,
          model: request.model,
          serialNumber: request.serialNumber,
          assignedEngineerId: userId,
          assignedEngineerName: assignmentData.assignedEngineer,
          createdById: userId,
          createdByRole: userRole,
          createdAt: nowStr,
          updatedAt: nowStr,
          timeline: JSON.stringify([timelineStep]),
          installationData: JSON.stringify(installationData)
        });
      } else {
        const jobTimeline = JSON.parse(existingJob.timeline || '[]');
        jobTimeline.unshift({
          status: 'Assigned',
          updatedAt: nowStr,
          updatedBy: userName,
          remarks: `Reassigned / Updated. Lead: ${assignmentData.assignedEngineer}`
        });

        const currentInstData = JSON.parse(existingJob.installationData || '{}');
        const installationData = {
          ...currentInstData,
          assignedEngineer: assignmentData.assignedEngineer,
          assignedTechnicians: assignmentData.assignedTechnicians,
          targetInstallationDate: assignmentData.targetInstallationDate,
          priority: assignmentData.priority,
          slaDueDate: assignmentData.slaDueDate,
          installationTerritory: assignmentData.installationTerritory,
          workflowStatus: 'Assigned'
        };

        await jobRepository.update(existingJob.id, {
          assignedEngineerName: assignmentData.assignedEngineer,
          priority: assignmentData.priority === 'Critical' ? 'Emergency' : assignmentData.priority === 'Urgent' ? 'Urgent' : 'Routine',
          timeline: JSON.stringify(jobTimeline),
          installationData: JSON.stringify(installationData)
        });
      }

      // 6. Create or Update active Installation tracking entry
      const existingInst = await installationRepository.findBySerialNumber(request.serialNumber);
      if (!existingInst) {
        await installationRepository.create({
          installationNumber: `INS-2026-${Date.now().toString().slice(-4)}`,
          instrumentId: `inst-${Date.now().toString().slice(-3)}`,
          instrumentName: request.instrumentName,
          serialNumber: request.serialNumber,
          customerId: `cust-${Date.now().toString().slice(-3)}`,
          customerName: request.customerName,
          location: request.departmentName,
          status: 'Assigned',
          createdAt: nowStr,
          slaDeadline: assignmentData.slaDueDate,
          createdById: userId,
          createdByName: userName,
          assignedStaffId: userId,
          assignedStaffName: assignmentData.assignedEngineer,
          assignedAt: nowStr,
          assignedById: userId,
          assignedByName: userName,
          checklist: JSON.stringify({
            unboxed: false,
            electricalSafetyChecked: false,
            calibrationVerified: false,
            userTrained: false
          }),
          warrantyCardUpdated: 0,
          brand: request.brand,
          model: request.model,
          warrantyPeriodMonths: request.warrantyUnit === 'Months' ? request.warrantyPeriod : request.warrantyUnit === 'Years' ? request.warrantyPeriod * 12 : 12,
          warrantyPeriodYears: request.warrantyUnit === 'Years' ? request.warrantyPeriod : 0
        });
      } else {
        await installationRepository.update(existingInst.id, {
          status: 'Assigned',
          assignedStaffName: assignmentData.assignedEngineer,
          assignedAt: nowStr,
          assignedByName: userName
        });
      }

      // 7. General audit log entry
      await auditRepository.create({
        timestamp: nowStr,
        userId,
        userName,
        userRole,
        action: 'ASSIGN_INSTALLATION',
        newValue: assignment.id,
        remarks: `Assigned lead engineer ${assignmentData.assignedEngineer} to request ${request.invoiceNumber}`
      });

      await connection.commit();
      logger.info(`InstallationService: Assignment successfully saved & committed for requestId ${requestId}`);
      return assignment;
    } catch (err) {
      await connection.rollback();
      logger.error(`InstallationService: Assignment transaction failed. Error: ${(err as Error).message}`);
      throw err;
    } finally {
      connection.release();
    }
  }

  // Workflow Progression logic
  async advanceStatus(
    requestId: string,
    newStatus: string,
    notes: string,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<InstallationRequestEntity> {
    logger.info(`InstallationService: Advancing request ${requestId} to status ${newStatus}`);

    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
      const request = await installationRequestRepository.findById(requestId);
      if (!request) {
        throw new NotFoundError(`Installation request with ID ${requestId} not found`);
      }

      const fromStatus = request.status;
      const nowStr = new Date().toISOString();

      // 1. Update the request status
      const updatedRequest = await installationRequestRepository.update(requestId, {
        status: newStatus
      });

      // 2. Create the assignment module audit log
      await installationAssignmentRepository.createAuditLog({
        requestId,
        action: 'ADVANCE_INSTALLATION_STATUS',
        fromStatus,
        toStatus: newStatus,
        performedBy: userName,
        performedByRole: userRole,
        notes: notes || `Advanced to ${newStatus}`
      });

      // 3. Update the corresponding service job if it exists
      const allJobs = await jobRepository.findAll({ limit: 1000 });
      const matchJob = allJobs.data.find(
        j => j.serialNumber === request.serialNumber && j.jobType === 'Installation'
      );

      if (matchJob) {
        const nextWorkflowStatus = newStatus === 'Scheduled' ? 'Scheduled' : newStatus === 'Installed' ? 'Completed' : 'Assigned';
        const nextJobStatus = nextWorkflowStatus === 'Completed' ? 'Completed' : 'On Site';
        const jobTimeline = JSON.parse(matchJob.timeline || '[]');

        jobTimeline.unshift({
          status: nextWorkflowStatus,
          updatedAt: nowStr,
          updatedBy: userName,
          remarks: notes || `Advanced to ${newStatus}`
        });

        const currentInstData = JSON.parse(matchJob.installationData || '{}');
        const installationData = {
          ...currentInstData,
          workflowStatus: nextWorkflowStatus
        };

        await jobRepository.update(matchJob.id, {
          status: nextJobStatus,
          timeline: JSON.stringify(jobTimeline),
          installationData: JSON.stringify(installationData)
        });
      }

      // 4. Update corresponding Installation status
      const matchInst = await installationRepository.findBySerialNumber(request.serialNumber);
      if (matchInst) {
        let s = 'Pending';
        if (newStatus === 'Assigned') s = 'Assigned';
        else if (newStatus === 'Scheduled') s = 'In Progress';
        else if (newStatus === 'Installed') s = 'In Progress';
        else if (newStatus === 'Closed') s = 'Completed';

        await installationRepository.update(matchInst.id, {
          status: s
        });
      }

      // 5. General audit log
      await auditRepository.create({
        timestamp: nowStr,
        userId,
        userName,
        userRole,
        action: 'ADVANCE_INSTALLATION_STATUS',
        previousValue: fromStatus,
        newValue: newStatus,
        remarks: `Advanced installation request ${requestId} to status ${newStatus}. Notes: ${notes}`
      });

      await connection.commit();
      logger.info(`InstallationService: Successfully advanced status to ${newStatus} for requestId ${requestId}`);
      return updatedRequest;
    } catch (err) {
      await connection.rollback();
      logger.error(`InstallationService: Advance status transaction failed. Error: ${(err as Error).message}`);
      throw err;
    } finally {
      connection.release();
    }
  }

  // Update Installation Completion / Checklist & Warranty details
  async updateInstallation(
    id: string,
    installationUpdates: Partial<InstallationEntity>,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<InstallationEntity> {
    logger.info(`InstallationService: Completing/Updating Installation Tracking Record ${id}`);

    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
      const originalInst = await installationRepository.findById(id);
      if (!originalInst) {
        throw new NotFoundError(`Installation record with ID ${id} not found`);
      }

      const nowStr = new Date().toISOString();

      // Ensure any nested objects/strings are correctly structured
      const nextInst = await installationRepository.update(id, installationUpdates);

      // Check if it transitioned to Completed and warranty cards are processed
      if (
        nextInst.status === 'Completed' &&
        nextInst.warrantyCardUpdated === 1 &&
        nextInst.warrantyStart &&
        nextInst.warrantyExpiry
      ) {
        logger.info(`InstallationService: Processing completion and warranty dates for serial ${nextInst.serialNumber}`);

        // 1. Update instrument asset in the asset registry
        const asset = await assetRepository.findBySerialNumber(nextInst.serialNumber);
        if (asset) {
          await assetRepository.update(asset.id, {
            installationDate: nextInst.warrantyStart,
            warrantyPeriodMonths: nextInst.warrantyPeriodMonths || 12,
            warrantyCardNumber: nextInst.warrantyCardNumber || `W-${Date.now().toString().slice(-6)}`
          });
        } else {
          // Fallback: create asset if it doesn't exist to prevent downstream breaks
          await assetRepository.create({
            assetNumber: `AST-${Date.now().toString().slice(-4)}`,
            serialNumber: nextInst.serialNumber,
            brand: nextInst.brand || 'SYSMEX',
            model: nextInst.model || 'Sysmex Model',
            description: nextInst.instrumentName,
            warrantyPeriodMonths: nextInst.warrantyPeriodMonths || 12,
            installationDate: nextInst.warrantyStart,
            customerName: nextInst.customerName,
            department: nextInst.location,
            warrantyCardNumber: nextInst.warrantyCardNumber || `W-${Date.now().toString().slice(-6)}`,
            serviceHistoryCount: 0,
            repairHistoryCount: 0,
            totalRevenueGenerated: 0
          });
        }

        // 2. Update service job status to Closed
        const allJobs = await jobRepository.findAll({ limit: 1000 });
        const matchJob = allJobs.data.find(
          j => j.serialNumber === nextInst.serialNumber && j.jobType === 'Installation'
        );

        if (matchJob) {
          const jobTimeline = JSON.parse(matchJob.timeline || '[]');
          jobTimeline.unshift({
            status: 'Closed',
            updatedAt: nowStr,
            updatedBy: userName,
            remarks: `Finalized warranty card and completed installation. Warranty Start: ${nextInst.warrantyStart}, Expiry: ${nextInst.warrantyExpiry}`
          });

          const currentInstData = JSON.parse(matchJob.installationData || '{}');
          const installationData = {
            ...currentInstData,
            workflowStatus: 'Completed'
          };

          await jobRepository.update(matchJob.id, {
            status: 'Closed',
            timeline: JSON.stringify(jobTimeline),
            installationData: JSON.stringify(installationData)
          });
        }

        // 3. Close out the initial installation request
        const request = await installationRequestRepository.findBySerialNumber(nextInst.serialNumber);
        if (request) {
          await installationRequestRepository.update(request.id, {
            status: 'Closed'
          });

          await installationAssignmentRepository.createAuditLog({
            requestId: request.id,
            action: 'ADVANCE_INSTALLATION_STATUS',
            fromStatus: request.status,
            toStatus: 'Closed',
            performedBy: userName,
            performedByRole: userRole,
            notes: `Successfully updated warranty card and closed out installation request.`
          });
        }
      }

      await auditRepository.create({
        timestamp: nowStr,
        userId,
        userName,
        userRole,
        action: 'UPDATE_INSTALLATION_TRACKER',
        newValue: id,
        remarks: `Updated installation tracker ${id} to status ${nextInst.status}`
      });

      await connection.commit();
      logger.info(`InstallationService: Installation tracker updated successfully.`);
      return nextInst;
    } catch (err) {
      await connection.rollback();
      logger.error(`InstallationService: Update installation transaction failed. Error: ${(err as Error).message}`);
      throw err;
    } finally {
      connection.release();
    }
  }

  // Get current state summary
  async getSummary(): Promise<any> {
    const requests = await installationRequestRepository.findAll({ limit: 1000 });
    const assignments = await installationAssignmentRepository.findAll({ limit: 1000 });
    const auditLogs = await installationAssignmentRepository.findAuditLogsAll();
    const installations = await installationRepository.findAll({ limit: 1000 });

    return {
      requests: requests.data,
      assignments: assignments.data,
      auditLogs,
      installations: installations.data
    };
  }
}

export const installationService = new InstallationService();
