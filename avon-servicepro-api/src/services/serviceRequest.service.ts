import { serviceRequestRepository, ServiceRequestEntity } from '../repositories/serviceRequest.repository';
import { serviceRequestAssignmentRepository, ServiceRequestAssignmentEntity } from '../repositories/serviceRequestAssignment.repository';
import { jobRepository } from '../repositories/job.repository';
import { auditRepository } from '../repositories/audit.repository';
import { dbPool } from '../config/database';
import { logger } from '../config/logger';
import { BadRequestError, NotFoundError } from '../utils/apiError';
import { v4 as uuidv4 } from 'uuid';

export class ServiceRequestService {
  async createRequest(
    reqData: Omit<ServiceRequestEntity, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'ticketNumber' | 'slaDueDate' | 'slaDaysSetting' | 'slaStatus'> & { ticketNumber?: string },
    userId: string,
    userName: string,
    userRole: string
  ): Promise<ServiceRequestEntity> {
    logger.info(`ServiceRequestService: Creating service request for serial ${reqData.serialNumber}`);

    const ticketNumber = reqData.ticketNumber || `AVN-SRQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Check if ticket number already exists
    const existingTicket = await serviceRequestRepository.findByTicketNumber(ticketNumber);
    if (existingTicket) {
      throw new BadRequestError(`A service request with ticket number ${ticketNumber} already exists`);
    }

    // Determine SLA days setting based on Priority
    let slaDaysSetting = 7; // Default MEDIUM
    const priorityUpper = (reqData.priority || 'MEDIUM').toUpperCase();
    if (priorityUpper === 'CRITICAL') {
      slaDaysSetting = 1;
    } else if (priorityUpper === 'HIGH') {
      slaDaysSetting = 3;
    } else if (priorityUpper === 'LOW') {
      slaDaysSetting = 10;
    }

    // Calculate SLA Due Date
    const now = new Date();
    const dueDate = new Date(now.getTime() + slaDaysSetting * 24 * 60 * 60 * 1000);
    const slaDueDate = dueDate.toISOString();

    const request = await serviceRequestRepository.create({
      ...reqData,
      ticketNumber,
      status: 'RECEIVED',
      slaDueDate,
      slaDaysSetting,
      slaStatus: 'IN_COMPLIANCE'
    });

    // Automatically sync and create/register a corresponding service job in service_jobs table to ensure zero functional duplicate
    const initialTimeline = [
      {
        status: 'RECEIVED',
        updatedAt: now.toISOString(),
        updatedBy: userName,
        remarks: 'Service request created and logged into enterprise system.'
      }
    ];

    let jobType = 'Non-Warranty Service';
    const descLower = (reqData.description || '').toLowerCase();
    const subjLower = (reqData.subject || '').toLowerCase();
    if (descLower.includes('warranty') || subjLower.includes('warranty')) {
      jobType = 'Warranty Repair';
    } else if (descLower.includes('calibration') || subjLower.includes('calibration')) {
      jobType = 'Calibration';
    }

    let jobPriority = 'Routine';
    if (priorityUpper === 'CRITICAL') {
      jobPriority = 'Emergency';
    } else if (priorityUpper === 'HIGH') {
      jobPriority = 'Urgent';
    }

    await jobRepository.create({
      jobType,
      status: 'Pending Assignment',
      priority: jobPriority,
      customerName: reqData.customerName,
      brand: reqData.brand,
      model: reqData.instrumentName, // Mapping model descriptive properties
      serialNumber: reqData.serialNumber,
      createdById: userId,
      createdByRole: userRole,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      timeline: JSON.stringify(initialTimeline)
    });

    // Create system audit trail log
    await auditRepository.create({
      timestamp: now.toISOString(),
      userId,
      userName,
      userRole,
      action: 'CREATE_SERVICE_REQUEST',
      newValue: request.id,
      remarks: `Logged service ticket ${ticketNumber} for customer ${request.customerName}, serial ${request.serialNumber}`
    });

    return request;
  }

  async listRequests(options?: any): Promise<{ data: ServiceRequestEntity[]; total: number }> {
    return serviceRequestRepository.findAll(options);
  }

  async getRequestDetails(id: string): Promise<any> {
    const request = await serviceRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundError(`Service request with ID ${id} not found`);
    }

    const assignment = await serviceRequestAssignmentRepository.findByRequestId(id);
    const auditLogs = await serviceRequestAssignmentRepository.findAuditLogsByRequestId(id);

    return {
      request,
      assignment,
      auditLogs
    };
  }

  async updateRequest(id: string, updates: Partial<ServiceRequestEntity>, userId: string, userName: string, userRole: string): Promise<ServiceRequestEntity> {
    logger.info(`ServiceRequestService: Updating service request ${id}`);
    const updated = await serviceRequestRepository.update(id, updates);

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action: 'UPDATE_SERVICE_REQUEST',
      newValue: id,
      remarks: `Updated properties of service request ${updated.ticketNumber}`
    });

    return updated;
  }

  async deleteRequest(id: string, userId: string, userName: string, userRole: string): Promise<boolean> {
    logger.info(`ServiceRequestService: Deleting service request ${id}`);
    const request = await serviceRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundError(`Service request with ID ${id} not found`);
    }

    await serviceRequestRepository.delete(id);

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action: 'DELETE_SERVICE_REQUEST',
      newValue: id,
      remarks: `Deleted service request ${request.ticketNumber}`
    });

    return true;
  }

  // ASSIGNMENT MANAGEMENT WORKFLOWS
  async assignRequest(
    requestId: string,
    assignmentData: Omit<ServiceRequestAssignmentEntity, 'id' | 'requestId' | 'createdAt' | 'updatedAt' | 'assignedBy' | 'assignmentDate'>,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<ServiceRequestAssignmentEntity> {
    logger.info(`ServiceRequestService: Assigning service request ${requestId} to ${assignmentData.assignedEngineerName}`);

    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Fetch and verify request
      const request = await serviceRequestRepository.findById(requestId);
      if (!request) {
        throw new NotFoundError(`Service request with ID ${requestId} not found`);
      }

      // 2. Update request status
      const originalStatus = request.status;
      const updatedRequest = await serviceRequestRepository.update(requestId, {
        status: 'DIAGNOSING'
      });

      // 3. Create or update assignment record
      let assignment = await serviceRequestAssignmentRepository.findByRequestId(requestId);
      const nowStr = new Date().toISOString();

      if (assignment) {
        assignment = await serviceRequestAssignmentRepository.update(assignment.id, {
          assignedEngineerId: assignmentData.assignedEngineerId,
          assignedEngineerName: assignmentData.assignedEngineerName,
          targetResolutionDate: assignmentData.targetResolutionDate,
          remarks: assignmentData.remarks
        });
      } else {
        assignment = await serviceRequestAssignmentRepository.create({
          requestId,
          assignedEngineerId: assignmentData.assignedEngineerId,
          assignedEngineerName: assignmentData.assignedEngineerName,
          assignedBy: userName,
          assignmentDate: nowStr.split('T')[0],
          targetResolutionDate: assignmentData.targetResolutionDate,
          remarks: assignmentData.remarks
        });
      }

      // 4. Create workflow audit log trace
      await serviceRequestAssignmentRepository.createAuditLog({
        requestId,
        action: 'ASSIGN_ENGINEER',
        fromStatus: originalStatus,
        toStatus: 'DIAGNOSING',
        performedBy: userName,
        performedByRole: userRole,
        notes: `Assigned engineer ${assignmentData.assignedEngineerName}. Target resolution: ${assignmentData.targetResolutionDate || 'None'}`
      });

      // 5. Sync details with the active corresponding Job in service_jobs
      const allJobs = await jobRepository.findAll({ limit: 1000 });
      const activeJob = allJobs.data.find(j => j.serialNumber === request.serialNumber);

      if (activeJob) {
        const currentTimeline = JSON.parse(activeJob.timeline || '[]');
        currentTimeline.push({
          status: 'DIAGNOSING',
          updatedAt: nowStr,
          updatedBy: userName,
          remarks: `Lead Engineer assigned: ${assignmentData.assignedEngineerName}. Diagnostic checks initiated.`
        });

        const sqlUpdate = `
          UPDATE service_jobs 
          SET status = 'DIAGNOSING', assignedEngineerId = ?, assignedEngineerName = ?, timeline = ?, updatedAt = ? 
          WHERE id = ?
        `;
        await dbPool.query(sqlUpdate, [
          assignmentData.assignedEngineerId,
          assignmentData.assignedEngineerName,
          JSON.stringify(currentTimeline),
          nowStr,
          activeJob.id
        ]);
      }

      await connection.commit();

      // Log central admin audit
      await auditRepository.create({
        timestamp: nowStr,
        userId,
        userName,
        userRole,
        action: 'ASSIGN_SERVICE_REQUEST',
        newValue: requestId,
        remarks: `Assigned service ticket ${request.ticketNumber} to ${assignmentData.assignedEngineerName}`
      });

      return assignment;
    } catch (err) {
      await connection.rollback();
      logger.error('ServiceRequestService: Failed to assign request', err);
      throw err;
    } finally {
      connection.release();
    }
  }

  // STATUS WORKFLOW TRANSITION
  async updateStatus(
    requestId: string,
    toStatus: string,
    notes: string,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<ServiceRequestEntity> {
    logger.info(`ServiceRequestService: Advancing status of request ${requestId} to ${toStatus}`);

    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
      const request = await serviceRequestRepository.findById(requestId);
      if (!request) {
        throw new NotFoundError(`Service request with ID ${requestId} not found`);
      }

      const originalStatus = request.status;
      const nowStr = new Date().toISOString();

      const updates: Partial<ServiceRequestEntity> = {
        status: toStatus
      };

      // Handle final resolution status logic
      if (toStatus === 'CLOSED') {
        updates.resolvedAt = nowStr;

        // Calculate actual downtime in hours
        const createdTime = new Date(request.createdAt).getTime();
        const resolvedTime = new Date(nowStr).getTime();
        const downTimeHours = parseFloat(((resolvedTime - createdTime) / (1000 * 60 * 60)).toFixed(2));
        updates.downTimeHours = downTimeHours;

        // Check SLA Breach condition
        const dueTime = new Date(request.slaDueDate).getTime();
        updates.slaStatus = resolvedTime > dueTime ? 'BREACHED' : 'IN_COMPLIANCE';
      }

      const updatedRequest = await serviceRequestRepository.update(requestId, updates);

      // Save workflow audit history
      await serviceRequestAssignmentRepository.createAuditLog({
        requestId,
        action: 'STATUS_TRANSITION',
        fromStatus: originalStatus,
        toStatus,
        performedBy: userName,
        performedByRole: userRole,
        notes
      });

      // Sync status updates into service_jobs table
      const allJobs = await jobRepository.findAll({ limit: 1000 });
      const activeJob = allJobs.data.find(j => j.serialNumber === request.serialNumber);

      if (activeJob) {
        const currentTimeline = JSON.parse(activeJob.timeline || '[]');
        currentTimeline.push({
          status: toStatus,
          updatedAt: nowStr,
          updatedBy: userName,
          remarks: notes || `Advanced ticket workflow state to ${toStatus}`
        });

        const sqlUpdate = `
          UPDATE service_jobs 
          SET status = ?, timeline = ?, updatedAt = ? 
          WHERE id = ?
        `;
        await dbPool.query(sqlUpdate, [
          toStatus,
          JSON.stringify(currentTimeline),
          nowStr,
          activeJob.id
        ]);
      }

      await connection.commit();

      // Write system log
      await auditRepository.create({
        timestamp: nowStr,
        userId,
        userName,
        userRole,
        action: 'TRANSITION_SERVICE_STATUS',
        newValue: requestId,
        remarks: `Updated service ticket ${request.ticketNumber} status from ${originalStatus} to ${toStatus}`
      });

      return updatedRequest;
    } catch (err) {
      await connection.rollback();
      logger.error('ServiceRequestService: Failed to transition status', err);
      throw err;
    } finally {
      connection.release();
    }
  }

  // COST ESTIMATES & PO WORKFLOWS
  async updateBilling(
    requestId: string,
    estimatedCost: number,
    billingApproved: boolean,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<ServiceRequestEntity> {
    logger.info(`ServiceRequestService: Updating billing details for request ${requestId}`);

    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
      const request = await serviceRequestRepository.findById(requestId);
      if (!request) {
        throw new NotFoundError(`Service request with ID ${requestId} not found`);
      }

      const nowStr = new Date().toISOString();
      const updatedRequest = await serviceRequestRepository.update(requestId, {
        estimatedCost,
        billingApproved: billingApproved ? 1 : 0
      });

      // Log in request audit logs
      await serviceRequestAssignmentRepository.createAuditLog({
        requestId,
        action: 'BILLING_UPDATE',
        fromStatus: request.status,
        toStatus: request.status,
        performedBy: userName,
        performedByRole: userRole,
        notes: `Cost updated to LKR ${estimatedCost}. Approval status: ${billingApproved ? 'APPROVED' : 'PENDING'}`
      });

      // Sync into active Job context as well
      const allJobs = await jobRepository.findAll({ limit: 1000 });
      const activeJob = allJobs.data.find(j => j.serialNumber === request.serialNumber);

      if (activeJob) {
        const currentTimeline = JSON.parse(activeJob.timeline || '[]');
        currentTimeline.push({
          status: activeJob.status,
          updatedAt: nowStr,
          updatedBy: userName,
          remarks: `Updated estimated costs to LKR ${estimatedCost}. Billing ${billingApproved ? 'APPROVED' : 'PENDING'}.`
        });

        const sqlUpdate = `
          UPDATE service_jobs 
          SET timeline = ?, updatedAt = ? 
          WHERE id = ?
        `;
        await dbPool.query(sqlUpdate, [
          JSON.stringify(currentTimeline),
          nowStr,
          activeJob.id
        ]);
      }

      await connection.commit();

      // System audit
      await auditRepository.create({
        timestamp: nowStr,
        userId,
        userName,
        userRole,
        action: 'UPDATE_SERVICE_BILLING',
        newValue: requestId,
        remarks: `Updated cost of ticket ${request.ticketNumber} to ${estimatedCost} LKR (Approval: ${billingApproved})`
      });

      return updatedRequest;
    } catch (err) {
      await connection.rollback();
      logger.error('ServiceRequestService: Failed to update billing', err);
      throw err;
    } finally {
      connection.release();
    }
  }
}

export const serviceRequestService = new ServiceRequestService();
