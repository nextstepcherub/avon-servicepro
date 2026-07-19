import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface ServiceRequestEntity {
  id: string;
  ticketNumber: string;
  instrumentId: string;
  instrumentName: string;
  brand: string;
  serialNumber: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  downTimeHours?: number;
  workshopBench?: string | null;
  estimatedCost?: number;
  billingApproved?: number; // 0 or 1
  slaDueDate: string;
  slaDaysSetting: number;
  slaStatus: string;
}

export class ServiceRequestRepository extends AbstractRepository<ServiceRequestEntity> {
  async create(entity: Omit<ServiceRequestEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceRequestEntity> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newReq: ServiceRequestEntity = {
      ...entity,
      id,
      createdAt: now,
      updatedAt: now
    };

    logger.info(`Repository: Saving service request ${id} with ticketNumber ${newReq.ticketNumber}`);
    const sql = `
      INSERT INTO service_requests (
        id, ticketNumber, instrumentId, instrumentName, brand, serialNumber, customerId, customerName,
        subject, description, priority, status, createdAt, updatedAt, resolvedAt, downTimeHours,
        workshopBench, estimatedCost, billingApproved, slaDueDate, slaDaysSetting, slaStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbPool.query(sql, [
      newReq.id, newReq.ticketNumber, newReq.instrumentId, newReq.instrumentName, newReq.brand, newReq.serialNumber,
      newReq.customerId, newReq.customerName, newReq.subject, newReq.description, newReq.priority,
      newReq.status, newReq.createdAt, newReq.updatedAt, newReq.resolvedAt, newReq.downTimeHours,
      newReq.workshopBench, newReq.estimatedCost, newReq.billingApproved, newReq.slaDueDate,
      newReq.slaDaysSetting, newReq.slaStatus
    ]);

    return newReq;
  }

  async findById(id: string): Promise<ServiceRequestEntity | null> {
    logger.info(`Repository: Fetching service request by ID: ${id}`);
    const sql = `SELECT * FROM service_requests WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? (rows[0] as ServiceRequestEntity) : null;
  }

  async findByTicketNumber(ticketNumber: string): Promise<ServiceRequestEntity | null> {
    logger.info(`Repository: Fetching service request by Ticket Number: ${ticketNumber}`);
    const sql = `SELECT * FROM service_requests WHERE ticketNumber = ?`;
    const rows = await dbPool.query(sql, [ticketNumber]);
    return rows.length > 0 ? (rows[0] as ServiceRequestEntity) : null;
  }

  async findBySerialNumber(serialNumber: string): Promise<ServiceRequestEntity[]> {
    logger.info(`Repository: Fetching service requests by Serial Number: ${serialNumber}`);
    const sql = `SELECT * FROM service_requests WHERE serialNumber = ?`;
    const rows = await dbPool.query(sql, [serialNumber]);
    return rows as ServiceRequestEntity[];
  }

  async findAll(options?: QueryOptions): Promise<{ data: ServiceRequestEntity[]; total: number }> {
    logger.info(`Repository: Listing service requests with options: ${JSON.stringify(options)}`);
    const limit = options?.limit ?? 100;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'createdAt';
    const sortOrder = options?.sortOrder ?? 'DESC';

    let whereClause = '1=1';
    const params: any[] = [];

    if (options?.search) {
      whereClause += ' AND (customerName LIKE ? OR instrumentName LIKE ? OR serialNumber = ? OR ticketNumber = ? OR subject LIKE ?)';
      const searchPattern = `%${options.search}%`;
      params.push(searchPattern, searchPattern, options.search, options.search, searchPattern);
    }

    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value !== undefined && value !== '' && value !== 'ALL') {
          whereClause += ` AND ${key} = ?`;
          params.push(value);
        }
      }
    }

    const countSql = `SELECT COUNT(*) as total FROM service_requests WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM service_requests 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;

    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;

    const queryParams = [...params, limit, offset];
    const data = (await dbPool.query(selectSql, queryParams)) as ServiceRequestEntity[];

    return { data, total };
  }

  async update(id: string, entity: Partial<ServiceRequestEntity>): Promise<ServiceRequestEntity> {
    logger.info(`Repository: Updating service request ${id}`);
    const original = await this.findById(id);
    if (!original) {
      throw new Error(`Service request with ID ${id} not found`);
    }

    const keys = Object.keys(entity).filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const params = keys.map(key => (entity as any)[key]);

    const now = new Date().toISOString();
    if (keys.length > 0) {
      const sql = `UPDATE service_requests SET ${setClause}, updatedAt = ? WHERE id = ?`;
      await dbPool.query(sql, [...params, now, id]);
    }

    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<boolean> {
    logger.info(`Repository: Deleting service request ${id}`);
    const sql = `DELETE FROM service_requests WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }
}

export const serviceRequestRepository = new ServiceRequestRepository();
