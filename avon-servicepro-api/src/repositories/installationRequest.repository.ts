import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface InstallationRequestEntity {
  id: string;
  invoiceNumber: string;
  invoiceValue: number;
  customerName: string;
  departmentName: string;
  endUserName: string;
  instrumentName: string;
  brand: string;
  model: string;
  serialNumber: string;
  deliveryDate: string;
  warrantyPeriod: number;
  warrantyUnit: string;
  remarks: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class InstallationRequestRepository extends AbstractRepository<InstallationRequestEntity> {
  async create(entity: Omit<InstallationRequestEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<InstallationRequestEntity> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newReq: InstallationRequestEntity = {
      ...entity,
      id,
      createdAt: now,
      updatedAt: now
    };

    logger.info(`Repository: Saving installation request ${id} with serialNumber ${newReq.serialNumber}`);
    const sql = `
      INSERT INTO installation_requests (
        id, invoiceNumber, invoiceValue, customerName, departmentName, endUserName,
        instrumentName, brand, model, serialNumber, deliveryDate, warrantyPeriod,
        warrantyUnit, remarks, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbPool.query(sql, [
      newReq.id, newReq.invoiceNumber, newReq.invoiceValue, newReq.customerName, newReq.departmentName, newReq.endUserName,
      newReq.instrumentName, newReq.brand, newReq.model, newReq.serialNumber, newReq.deliveryDate, newReq.warrantyPeriod,
      newReq.warrantyUnit, newReq.remarks, newReq.status, newReq.createdAt, newReq.updatedAt
    ]);

    return newReq;
  }

  async findById(id: string): Promise<InstallationRequestEntity | null> {
    logger.info(`Repository: Fetching installation request by ID: ${id}`);
    const sql = `SELECT * FROM installation_requests WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? (rows[0] as InstallationRequestEntity) : null;
  }

  async findBySerialNumber(serialNumber: string): Promise<InstallationRequestEntity | null> {
    logger.info(`Repository: Fetching installation request by Serial Number: ${serialNumber}`);
    const sql = `SELECT * FROM installation_requests WHERE serialNumber = ?`;
    const rows = await dbPool.query(sql, [serialNumber]);
    return rows.length > 0 ? (rows[0] as InstallationRequestEntity) : null;
  }

  async findAll(options?: QueryOptions): Promise<{ data: InstallationRequestEntity[]; total: number }> {
    logger.info(`Repository: Listing installation requests with options: ${JSON.stringify(options)}`);
    const limit = options?.limit ?? 100;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'createdAt';
    const sortOrder = options?.sortOrder ?? 'DESC';

    let whereClause = '1=1';
    const params: any[] = [];

    if (options?.search) {
      whereClause += ' AND (customerName LIKE ? OR instrumentName LIKE ? OR serialNumber = ? OR invoiceNumber = ?)';
      const searchPattern = `%${options.search}%`;
      params.push(searchPattern, searchPattern, options.search, options.search);
    }

    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value !== undefined && value !== '' && value !== 'ALL') {
          whereClause += ` AND ${key} = ?`;
          params.push(value);
        }
      }
    }

    const countSql = `SELECT COUNT(*) as total FROM installation_requests WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM installation_requests 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;

    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;

    const queryParams = [...params, limit, offset];
    const data = (await dbPool.query(selectSql, queryParams)) as InstallationRequestEntity[];

    return { data, total };
  }

  async update(id: string, entity: Partial<InstallationRequestEntity>): Promise<InstallationRequestEntity> {
    logger.info(`Repository: Updating installation request ${id}`);
    const original = await this.findById(id);
    if (!original) {
      throw new Error(`Installation request with ID ${id} not found`);
    }

    const keys = Object.keys(entity).filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const params = keys.map(key => (entity as any)[key]);

    const now = new Date().toISOString();
    if (keys.length > 0) {
      const sql = `UPDATE installation_requests SET ${setClause}, updatedAt = ? WHERE id = ?`;
      await dbPool.query(sql, [...params, now, id]);
    }

    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<boolean> {
    logger.info(`Repository: Deleting installation request ${id}`);
    const sql = `DELETE FROM installation_requests WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }
}

export const installationRequestRepository = new InstallationRequestRepository();
