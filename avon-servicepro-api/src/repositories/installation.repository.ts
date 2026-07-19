import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface InstallationEntity {
  id: string;
  installationNumber: string;
  instrumentId: string;
  instrumentName: string;
  serialNumber: string;
  customerId: string;
  customerName: string;
  location: string;
  status: string;
  createdAt: string;
  slaDeadline: string;
  createdById: string;
  createdByName: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedAt?: string;
  assignedById?: string;
  assignedByName?: string;
  completedAt?: string;
  completedById?: string;
  completedByName?: string;
  reportNotes?: string;
  checklist?: string; // Stored as JSON string
  warrantyCardUpdated?: number; // TINYINT
  warrantyCardUpdatedBy?: string;
  warrantyCardUpdatedById?: string;
  warrantyCardUpdatedAt?: string;
  warrantyStart?: string;
  warrantyExpiry?: string;
  brand?: string;
  model?: string;
  warrantyCardNumber?: string;
  warrantyPeriodMonths?: number;
  warrantyPeriodYears?: number;
}

export class InstallationRepository extends AbstractRepository<InstallationEntity> {
  async create(entity: Omit<InstallationEntity, 'id'>): Promise<InstallationEntity> {
    const id = uuidv4();
    const newInst: InstallationEntity = { ...entity, id };

    logger.info(`Repository: Saving installation ${id} for serialNumber ${newInst.serialNumber}`);
    const sql = `
      INSERT INTO installations (
        id, installationNumber, instrumentId, instrumentName, serialNumber, customerId,
        customerName, location, status, createdAt, slaDeadline, createdById, createdByName,
        assignedStaffId, assignedStaffName, assignedAt, assignedById, assignedByName,
        completedAt, completedById, completedByName, reportNotes, checklist, warrantyCardUpdated,
        warrantyCardUpdatedBy, warrantyCardUpdatedById, warrantyCardUpdatedAt, warrantyStart,
        warrantyExpiry, brand, model, warrantyCardNumber, warrantyPeriodMonths, warrantyPeriodYears
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbPool.query(sql, [
      newInst.id, newInst.installationNumber, newInst.instrumentId, newInst.instrumentName, newInst.serialNumber,
      newInst.customerId, newInst.customerName, newInst.location, newInst.status, newInst.createdAt, newInst.slaDeadline,
      newInst.createdById, newInst.createdByName, newInst.assignedStaffId, newInst.assignedStaffName, newInst.assignedAt,
      newInst.assignedById, newInst.assignedByName, newInst.completedAt, newInst.completedById, newInst.completedByName,
      newInst.reportNotes, newInst.checklist, newInst.warrantyCardUpdated ?? 0, newInst.warrantyCardUpdatedBy,
      newInst.warrantyCardUpdatedById, newInst.warrantyCardUpdatedAt, newInst.warrantyStart, newInst.warrantyExpiry,
      newInst.brand, newInst.model, newInst.warrantyCardNumber, newInst.warrantyPeriodMonths, newInst.warrantyPeriodYears
    ]);

    return newInst;
  }

  async findById(id: string): Promise<InstallationEntity | null> {
    const sql = `SELECT * FROM installations WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? (rows[0] as InstallationEntity) : null;
  }

  async findBySerialNumber(serialNumber: string): Promise<InstallationEntity | null> {
    const sql = `SELECT * FROM installations WHERE serialNumber = ?`;
    const rows = await dbPool.query(sql, [serialNumber]);
    return rows.length > 0 ? (rows[0] as InstallationEntity) : null;
  }

  async findAll(options?: QueryOptions): Promise<{ data: InstallationEntity[]; total: number }> {
    const limit = options?.limit ?? 100;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'createdAt';
    const sortOrder = options?.sortOrder ?? 'DESC';

    let whereClause = '1=1';
    const params: any[] = [];

    if (options?.search) {
      whereClause += ' AND (customerName LIKE ? OR instrumentName LIKE ? OR serialNumber = ? OR installationNumber = ?)';
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

    const countSql = `SELECT COUNT(*) as total FROM installations WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM installations 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;

    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;

    const queryParams = [...params, limit, offset];
    const data = (await dbPool.query(selectSql, queryParams)) as InstallationEntity[];

    return { data, total };
  }

  async update(id: string, entity: Partial<InstallationEntity>): Promise<InstallationEntity> {
    logger.info(`Repository: Updating installation record ${id}`);
    const original = await this.findById(id);
    if (!original) {
      throw new Error(`Installation record with ID ${id} not found`);
    }

    const keys = Object.keys(entity).filter(key => key !== 'id');
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const params = keys.map(key => (entity as any)[key]);

    if (keys.length > 0) {
      const sql = `UPDATE installations SET ${setClause} WHERE id = ?`;
      await dbPool.query(sql, [...params, id]);
    }

    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM installations WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }
}

export const installationRepository = new InstallationRepository();
