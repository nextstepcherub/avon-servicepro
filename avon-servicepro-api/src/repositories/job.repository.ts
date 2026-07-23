import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface JobEntity {
  id: string;
  jobType: string;
  status: string;
  priority: string;
  customerName: string;
  brand: string;
  model: string;
  serialNumber: string;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  createdById: string;
  createdByRole: string;
  createdAt: string;
  updatedAt: string;
  timeline: string; // JSON string in DB
  feedback?: string; // JSON string in DB
  partsReceiving?: string; // JSON string in DB
  installationData?: string;
  warrantyServiceData?: string;
  nonWarrantyData?: string;
  warrantyRepairData?: string;
  workshopJobData?: string;
  calibrationData?: string;
}

export class JobRepository extends AbstractRepository<JobEntity> {
  private mapRow(row: any): JobEntity {
    if (!row) return row;
    return {
      id: row.id,
      jobType: row.jobType ?? row.jobtype,
      status: row.status,
      priority: row.priority,
      customerName: row.customerName ?? row.customername,
      brand: row.brand,
      model: row.model,
      serialNumber: row.serialNumber ?? row.serialnumber,
      assignedEngineerId: row.assignedEngineerId ?? row.assignedengineerid,
      assignedEngineerName: row.assignedEngineerName ?? row.assignedengineername,
      createdById: row.createdById ?? row.createdbyid,
      createdByRole: row.createdByRole ?? row.createdbyrole,
      createdAt: row.createdAt ?? row.createdat,
      updatedAt: row.updatedAt ?? row.updatedat,
      timeline: row.timeline,
      feedback: row.feedback,
      partsReceiving: row.partsReceiving ?? row.partsreceiving,
      installationData: row.installationData ?? row.installationdata,
      warrantyServiceData: row.warrantyServiceData ?? row.warrantyservicedata,
      nonWarrantyData: row.nonWarrantyData ?? row.nonwarrantydata,
      warrantyRepairData: row.warrantyRepairData ?? row.warrantyrepairdata,
      workshopJobData: row.workshopJobData ?? row.workshopjobdata,
      calibrationData: row.calibrationData ?? row.calibrationdata,
    };
  }

  async create(entity: Omit<JobEntity, 'id'>): Promise<JobEntity> {
    const id = uuidv4();
    const newJob: JobEntity = { ...entity, id };
    
    logger.info(`Repository: Saving new service job ${id} into jobs table`);
    const sql = `
      INSERT INTO service_jobs (
        id, jobType, status, priority, customerName, brand, model, serialNumber,
        assignedEngineerId, assignedEngineerName, createdById, createdByRole,
        createdAt, updatedAt, timeline, feedback, partsReceiving
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await dbPool.query(sql, [
      newJob.id, newJob.jobType, newJob.status, newJob.priority, newJob.customerName,
      newJob.brand, newJob.model, newJob.serialNumber, newJob.assignedEngineerId,
      newJob.assignedEngineerName, newJob.createdById, newJob.createdByRole,
      newJob.createdAt, newJob.updatedAt, newJob.timeline, newJob.feedback, newJob.partsReceiving
    ]);
    
    return newJob;
  }

  async findById(id: string): Promise<JobEntity | null> {
    logger.info(`Repository: Fetching job by ID: ${id}`);
    const sql = `SELECT * FROM service_jobs WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? this.mapRow(rows[0]) : null;
  }

  async findAll(options?: QueryOptions): Promise<{ data: JobEntity[]; total: number }> {
    logger.info(`Repository: Listing jobs with query options: ${JSON.stringify(options)}`);
    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'createdAt';
    const sortOrder = options?.sortOrder ?? 'DESC';
    
    let whereClause = '1=1';
    const params: any[] = [];
    
    if (options?.search) {
      whereClause += ' AND (customerName LIKE ? OR brand LIKE ? OR model LIKE ? OR serialNumber = ?)';
      const searchPattern = `%${options.search}%`;
      params.push(searchPattern, searchPattern, searchPattern, options.search);
    }
    
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value !== undefined && value !== '') {
          whereClause += ` AND ${key} = ?`;
          params.push(value);
        }
      }
    }
    
    const countSql = `SELECT COUNT(*) as total FROM service_jobs WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM service_jobs 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;
    
    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;
    
    const queryParams = [...params, limit, offset];
    const rawData = await dbPool.query(selectSql, queryParams);
    const data = (rawData || []).map((row: any) => this.mapRow(row));
    
    return { data, total };
  }

  async update(id: string, entity: Partial<JobEntity>): Promise<JobEntity> {
    logger.info(`Repository: Updating job ${id}`);
    const original = await this.findById(id);
    if (!original) {
      throw new Error(`Job with ID ${id} not found`);
    }
    
    const updatedEntity: Record<string, any> = {
      ...entity,
      updatedAt: entity.updatedAt || new Date().toISOString()
    };
    delete updatedEntity.id;
    
    const keys = Object.keys(updatedEntity);
    if (keys.length > 0) {
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const params = keys.map(key => updatedEntity[key]);
      const sql = `UPDATE service_jobs SET ${setClause} WHERE id = ?`;
      await dbPool.query(sql, [...params, id]);
    }
    
    const updatedJob = await this.findById(id);
    return updatedJob!;
  }

  async delete(id: string): Promise<boolean> {
    logger.info(`Repository: Deleting job ${id}`);
    const sql = `DELETE FROM service_jobs WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }
}

export const jobRepository = new JobRepository();
