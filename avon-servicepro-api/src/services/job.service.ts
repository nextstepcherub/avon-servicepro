import { jobRepository, JobEntity } from '../repositories/job.repository';
import { assetRepository } from '../repositories/asset.repository';
import { customerRepository } from '../repositories/customer.repository';
import { auditRepository } from '../repositories/audit.repository';
import { dbPool } from '../config/database';
import { logger } from '../config/logger';
import { BadRequestError, NotFoundError } from '../utils/apiError';
import { kpiService } from './kpi.service';

export class JobService {
  async createJob(jobData: Omit<JobEntity, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>, userId: string, userName: string, userRole: string): Promise<JobEntity> {
    logger.info(`JobService: Creating new ticket of type: ${jobData.jobType} for serial ${jobData.serialNumber}`);
    
    // Verify asset exists in registry
    const asset = await assetRepository.findBySerialNumber(jobData.serialNumber);
    if (!asset) {
      throw new BadRequestError(`No registered medical instrument asset matches Serial Number: ${jobData.serialNumber}`);
    }
    
    const now = new Date().toISOString();
    const initialTimeline = [{
      status: jobData.status,
      updatedBy: userName,
      updatedAt: now,
      remarks: 'Service Request Ticket Initiated in Workspace Registry.'
    }];

    const job = await jobRepository.create({
      ...jobData,
      createdAt: now,
      updatedAt: now,
      timeline: JSON.stringify(initialTimeline),
    });

    await auditRepository.create({
      timestamp: now,
      userId,
      userName,
      userRole,
      action: 'CREATE_JOB',
      newValue: job.id,
      remarks: `Created ticket of type ${job.jobType} with initial status ${job.status}`,
    });

    return job;
  }

  async getJobDetails(id: string): Promise<JobEntity> {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new NotFoundError(`Service ticket with ID ${id} not found`);
    }
    return job;
  }

  async updateJobWorkflow(
    jobId: string,
    updates: Partial<JobEntity>,
    remarks: string,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<JobEntity> {
    logger.info(`JobService: Transitioning workflow for job: ${jobId} to status: ${updates.status}`);
    
    // Begin TRANSACTION as multiple tables (jobs, assets, customers, audits) are being updated!
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
      const originalJob = await jobRepository.findById(jobId);
      if (!originalJob) {
        throw new NotFoundError(`Service ticket with ID ${jobId} not found`);
      }

      const originalTimeline = JSON.parse(originalJob.timeline) as any[];
      const now = new Date().toISOString();
      
      const newTimelineStep = {
        status: updates.status || originalJob.status,
        updatedBy: userName,
        updatedAt: now,
        remarks: remarks || `Workflow status changed to ${updates.status}`
      };

      const updatedTimeline = [newTimelineStep, ...originalTimeline];
      
      const jobUpdates: Partial<JobEntity> = {
        ...updates,
        timeline: JSON.stringify(updatedTimeline),
        updatedAt: now
      };

      const resultJob = await jobRepository.update(jobId, jobUpdates);

      // Business logic on Job Completion
      if (updates.status === 'Closed' && originalJob.status !== 'Closed') {
        logger.info(`JobService: Job ${jobId} is closing. Processing asset updates and revenue calculations.`);
        
        const asset = await assetRepository.findBySerialNumber(originalJob.serialNumber);
        if (asset) {
          const assetUpdates: any = {};
          
          if (originalJob.jobType === 'Installation') {
            assetUpdates.installationDate = now.split('T')[0];
          }
          
          if (originalJob.jobType === 'Warranty Service') {
            assetUpdates.serviceHistoryCount = asset.serviceHistoryCount + 1;
          } else {
            assetUpdates.repairHistoryCount = asset.repairHistoryCount + 1;
          }

          // Calculate revenue
          let billingRevenue = 0;
          if (originalJob.nonWarrantyData) {
            try {
              const nonWarranty = JSON.parse(originalJob.nonWarrantyData);
              const invoiceService = nonWarranty.invoiceAmountService || 0;
              const invoiceCal = nonWarranty.invoiceAmountCalibration || 0;
              billingRevenue = invoiceService + invoiceCal;
            } catch (e) {}
          } else if (originalJob.calibrationData) {
            try {
              const calData = JSON.parse(originalJob.calibrationData);
              billingRevenue = calData.invoiceAmount || 0;
            } catch (e) {}
          }

          if (billingRevenue > 0) {
            assetUpdates.totalRevenueGenerated = asset.totalRevenueGenerated + billingRevenue;
            
            // Also update customer revenue
            const customer = await customerRepository.findByName(originalJob.customerName);
            if (customer) {
              await customerRepository.update(customer.id, {
                totalRevenue: customer.totalRevenue + billingRevenue
              });
            }
          }

          await assetRepository.update(asset.id, assetUpdates);
        }
      }

      await auditRepository.create({
        timestamp: now,
        userId,
        userName,
        userRole,
        action: 'UPDATE_JOB_WORKFLOW',
        previousValue: originalJob.status,
        newValue: updates.status || originalJob.status,
        remarks: `Updated job ${jobId} to status ${updates.status}. Notes: ${remarks}`
      });

      await connection.commit();
      logger.info(`JobService: Workflow successfully transitioned and committed for job ${jobId}`);

      // Integrate with KPI: Auto-evaluate employee's KPI assignments upon job status change/completion
      if (resultJob.assignedEngineerId) {
        try {
          const assignments = await dbPool.query(
            `SELECT DISTINCT financialYearId FROM employee_kpi_assignments WHERE employeeId = ?`,
            [resultJob.assignedEngineerId]
          );
          if (assignments && assignments.length > 0) {
            for (const a of assignments) {
              await kpiService.evaluateEmployeeKpis(resultJob.assignedEngineerId, a.financialYearId);
            }
          }
        } catch (kpiError) {
          logger.error(`JobService: Failed to auto-evaluate KPI for engineer ${resultJob.assignedEngineerId}: ${(kpiError as Error).message}`);
        }
      }

      return resultJob;
    } catch (error) {
      await connection.rollback();
      logger.error(`JobService: Failed to update workflow for job ${jobId}. Rolled back transaction.`);
      throw error;
    } finally {
      connection.release();
    }
  }

  async assignJob(
    jobId: string,
    assignedEngineerId: string,
    assignedEngineerName: string,
    remarks: string,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<JobEntity> {
    logger.info(`JobService: Assigning service job ${jobId} to engineer: ${assignedEngineerName}`);
    
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();
    
    try {
      const originalJob = await jobRepository.findById(jobId);
      if (!originalJob) {
        throw new NotFoundError(`Service ticket with ID ${jobId} not found`);
      }
      
      const originalTimeline = JSON.parse(originalJob.timeline) as any[];
      const now = new Date().toISOString();
      
      const newTimelineStep = {
        status: 'Assigned',
        updatedBy: userName,
        updatedAt: now,
        remarks: remarks || `Engineer ${assignedEngineerName} assigned to service ticket.`
      };
      
      const updatedTimeline = [newTimelineStep, ...originalTimeline];
      
      const jobUpdates: Partial<JobEntity> = {
        assignedEngineerId,
        assignedEngineerName,
        status: 'Assigned',
        timeline: JSON.stringify(updatedTimeline),
        updatedAt: now
      };
      
      const resultJob = await jobRepository.update(jobId, jobUpdates);
      
      await auditRepository.create({
        timestamp: now,
        userId,
        userName,
        userRole,
        action: 'ASSIGN_ENGINEER_JOB',
        previousValue: originalJob.assignedEngineerId || 'Unassigned',
        newValue: assignedEngineerId,
        remarks: `Assigned job ${jobId} to engineer ${assignedEngineerName}. Notes: ${remarks}`
      });
      
      await connection.commit();
      
      // Auto-evaluate KPI on assignment
      try {
        const assignments = await dbPool.query(
          `SELECT DISTINCT financialYearId FROM employee_kpi_assignments WHERE employeeId = ?`,
          [assignedEngineerId]
        );
        if (assignments && assignments.length > 0) {
          for (const a of assignments) {
            await kpiService.evaluateEmployeeKpis(assignedEngineerId, a.financialYearId);
          }
        }
      } catch (kpiError) {
        logger.error(`JobService: KPI evaluation failed after assignment: ${(kpiError as Error).message}`);
      }
      
      return resultJob;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async addJobReport(
    jobId: string,
    reportType: string,
    reportData: any,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<JobEntity> {
    logger.info(`JobService: Adding report to service job ${jobId} of type: ${reportType}`);
    
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();
    
    try {
      const originalJob = await jobRepository.findById(jobId);
      if (!originalJob) {
        throw new NotFoundError(`Service ticket with ID ${jobId} not found`);
      }
      
      const originalTimeline = JSON.parse(originalJob.timeline) as any[];
      const now = new Date().toISOString();
      
      const jobUpdates: Partial<JobEntity> = {};
      let transitionStatus = originalJob.status;
      
      if (originalJob.jobType === 'Workshop Job') {
        const existingData = originalJob.workshopJobData ? JSON.parse(originalJob.workshopJobData) : {};
        const updatedData = {
          ...existingData,
          ...reportData,
          acceptanceDate: existingData.acceptanceDate || now,
          itemSerialNumber: existingData.itemSerialNumber || originalJob.serialNumber
        };
        jobUpdates.workshopJobData = JSON.stringify(updatedData);
        transitionStatus = 'Completed';
      } else if (originalJob.jobType === 'Non-Warranty Service') {
        const existingData = originalJob.nonWarrantyData ? JSON.parse(originalJob.nonWarrantyData) : {};
        const updatedData = {
          ...existingData,
          ...reportData,
          inspectionDone: true,
          inspectionReport: reportData.inspectionReport || 'Technical report logged.'
        };
        jobUpdates.nonWarrantyData = JSON.stringify(updatedData);
        transitionStatus = 'Inspection Done';
      } else if (originalJob.jobType === 'Warranty Repair') {
        const existingData = originalJob.warrantyRepairData ? JSON.parse(originalJob.warrantyRepairData) : {};
        const updatedData = {
          ...existingData,
          ...reportData,
          inspectionDone: true,
          inspectionReport: reportData.inspectionReport || 'Technical warranty report logged.'
        };
        jobUpdates.warrantyRepairData = JSON.stringify(updatedData);
        transitionStatus = 'Inspection Done';
      } else if (originalJob.jobType === 'Calibration') {
        const existingData = originalJob.calibrationData ? JSON.parse(originalJob.calibrationData) : {};
        const updatedData = {
          ...existingData,
          ...reportData,
          calibrationDate: reportData.calibrationDate || now.split('T')[0],
          certificateNumber: reportData.certificateNumber || `CAL-CERT-${Date.now()}`
        };
        jobUpdates.calibrationData = JSON.stringify(updatedData);
        transitionStatus = 'Completed';
      }
      
      const newTimelineStep = {
        status: transitionStatus,
        updatedBy: userName,
        updatedAt: now,
        remarks: `Technical report logged: ${reportType}.`
      };
      
      jobUpdates.status = transitionStatus;
      jobUpdates.timeline = JSON.stringify([newTimelineStep, ...originalTimeline]);
      jobUpdates.updatedAt = now;
      
      const resultJob = await jobRepository.update(jobId, jobUpdates);
      
      await auditRepository.create({
        timestamp: now,
        userId,
        userName,
        userRole,
        action: 'LOG_JOB_REPORT',
        previousValue: originalJob.status,
        newValue: transitionStatus,
        remarks: `Logged report of type ${reportType} for job ${jobId}. Status updated to ${transitionStatus}.`
      });
      
      await connection.commit();
      
      if (resultJob.assignedEngineerId) {
        try {
          const assignments = await dbPool.query(
            `SELECT DISTINCT financialYearId FROM employee_kpi_assignments WHERE employeeId = ?`,
            [resultJob.assignedEngineerId]
          );
          for (const a of assignments) {
            await kpiService.evaluateEmployeeKpis(resultJob.assignedEngineerId, a.financialYearId);
          }
        } catch (e) {}
      }
      
      return resultJob;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async addJobMeasurements(
    jobId: string,
    measurements: any,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<JobEntity> {
    logger.info(`JobService: Saving diagnostic measurements for service job ${jobId}`);
    
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();
    
    try {
      const originalJob = await jobRepository.findById(jobId);
      if (!originalJob) {
        throw new NotFoundError(`Service ticket with ID ${jobId} not found`);
      }
      
      const originalTimeline = JSON.parse(originalJob.timeline) as any[];
      const now = new Date().toISOString();
      
      const jobUpdates: Partial<JobEntity> = {};
      let transitionStatus = originalJob.status;
      
      if (originalJob.jobType === 'Calibration') {
        const existingData = originalJob.calibrationData ? JSON.parse(originalJob.calibrationData) : {};
        const updatedData = {
          ...existingData,
          measurements: {
            ...existingData.measurements,
            ...measurements
          }
        };
        jobUpdates.calibrationData = JSON.stringify(updatedData);
        transitionStatus = 'Tested';
      } else if (originalJob.jobType === 'Workshop Job') {
        const existingData = originalJob.workshopJobData ? JSON.parse(originalJob.workshopJobData) : {};
        const updatedData = {
          ...existingData,
          measurements: {
            ...existingData.measurements,
            ...measurements
          }
        };
        jobUpdates.workshopJobData = JSON.stringify(updatedData);
        transitionStatus = 'Repair Completed';
      } else if (originalJob.jobType === 'Non-Warranty Service') {
        const existingData = originalJob.nonWarrantyData ? JSON.parse(originalJob.nonWarrantyData) : {};
        const updatedData = {
          ...existingData,
          measurements: {
            ...existingData.measurements,
            ...measurements
          }
        };
        jobUpdates.nonWarrantyData = JSON.stringify(updatedData);
        transitionStatus = 'Repair Completed';
      } else if (originalJob.jobType === 'Warranty Repair') {
        const existingData = originalJob.warrantyRepairData ? JSON.parse(originalJob.warrantyRepairData) : {};
        const updatedData = {
          ...existingData,
          measurements: {
            ...existingData.measurements,
            ...measurements
          }
        };
        jobUpdates.warrantyRepairData = JSON.stringify(updatedData);
        transitionStatus = 'Repair Completed';
      }
      
      const newTimelineStep = {
        status: transitionStatus,
        updatedBy: userName,
        updatedAt: now,
        remarks: 'Technical calibration/diagnostic measurements successfully recorded.'
      };
      
      jobUpdates.status = transitionStatus;
      jobUpdates.timeline = JSON.stringify([newTimelineStep, ...originalTimeline]);
      jobUpdates.updatedAt = now;
      
      const resultJob = await jobRepository.update(jobId, jobUpdates);
      
      await auditRepository.create({
        timestamp: now,
        userId,
        userName,
        userRole,
        action: 'LOG_JOB_MEASUREMENTS',
        previousValue: originalJob.status,
        newValue: transitionStatus,
        remarks: `Recorded diagnostic measurements for job ${jobId}. Status updated to ${transitionStatus}.`
      });
      
      await connection.commit();
      
      if (resultJob.assignedEngineerId) {
        try {
          const assignments = await dbPool.query(
            `SELECT DISTINCT financialYearId FROM employee_kpi_assignments WHERE employeeId = ?`,
            [resultJob.assignedEngineerId]
          );
          for (const a of assignments) {
            await kpiService.evaluateEmployeeKpis(resultJob.assignedEngineerId, a.financialYearId);
          }
        } catch (e) {}
      }
      
      return resultJob;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export const jobService = new JobService();
