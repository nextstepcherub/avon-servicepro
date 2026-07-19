import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class JobService {
  async createJob(input: any, actorId: string, actorName: string, actorRole: string) {
    const id = `job-${uuidv4().slice(0, 8)}`;
    const job = {
      id,
      ...input,
      createdAt: new Date().toISOString()
    };
    await dbPool.query(
      `INSERT INTO service_jobs (
        id, jobType, status, priority, customerName, brand, model, serialNumber,
        createdById, createdByRole, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, job.jobType, job.status, job.priority, job.customerName, job.brand, job.model, job.serialNumber,
        actorId, actorRole, job.createdAt
      ]
    );
    return job;
  }

  async assignJob(jobId: string, engineerId: string, engineerName: string, remarks: string, actorId: string, actorName: string, actorRole: string) {
    await dbPool.query(
      'UPDATE service_jobs SET status = "Assigned", assignedEngineerId = ?, assignedEngineerName = ? WHERE id = ?',
      [engineerId, engineerName, jobId]
    );
    const rows = await dbPool.query('SELECT * FROM service_jobs WHERE id = ?', [jobId]);
    return rows[0];
  }

  async addJobMeasurements(jobId: string, measurementsData: any, actorId: string, actorName: string, actorRole: string) {
    const rows = await dbPool.query('SELECT * FROM service_jobs WHERE id = ?', [jobId]);
    if (!rows || rows.length === 0) throw new Error('Job not found');
    const job = rows[0];

    const status = job.jobType === 'Workshop Job' ? 'Repair Completed' : 'Tested';
    const calibrationData = JSON.stringify({ measurements: measurementsData });

    await dbPool.query(
      'UPDATE service_jobs SET status = ?, calibrationData = ? WHERE id = ?',
      [status, calibrationData, jobId]
    );

    const updatedRows = await dbPool.query('SELECT * FROM service_jobs WHERE id = ?', [jobId]);
    return updatedRows[0];
  }

  async addJobReport(jobId: string, reportType: string, reportData: any, actorId: string, actorName: string, actorRole: string) {
    const rows = await dbPool.query('SELECT * FROM service_jobs WHERE id = ?', [jobId]);
    if (!rows || rows.length === 0) throw new Error('Job not found');
    const job = rows[0];

    let currentCal: any = {};
    if (job.calibrationData) {
      try {
        currentCal = JSON.parse(job.calibrationData);
      } catch (e) {}
    }

    const updatedCal = {
      ...currentCal,
      ...reportData,
      reportType
    };

    await dbPool.query(
      'UPDATE service_jobs SET status = "Completed", calibrationData = ? WHERE id = ?',
      [JSON.stringify(updatedCal), jobId]
    );

    const updatedRows = await dbPool.query('SELECT * FROM service_jobs WHERE id = ?', [jobId]);
    return updatedRows[0];
  }

  async updateJobWorkflow(jobId: string, data: any, remarks: string, actorId: string, actorName: string, actorRole: string) {
    if (data.status) {
      await dbPool.query('UPDATE service_jobs SET status = ? WHERE id = ?', [data.status, jobId]);
    }
    const rows = await dbPool.query('SELECT * FROM service_jobs WHERE id = ?', [jobId]);
    return rows[0];
  }
}

export const jobService = new JobService();
export default jobService;
