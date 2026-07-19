import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface ServiceRequestAssignmentEntity {
  id: string;
  requestId: string;
  assignedEngineerId: string;
  assignedEngineerName: string;
  assignedBy: string;
  assignmentDate: string;
  targetResolutionDate?: string | null;
  remarks?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestAuditLogEntity {
  id: string;
  requestId: string;
  action: string;
  fromStatus?: string | null;
  toStatus: string;
  performedBy: string;
  performedByRole: string;
  notes?: string | null;
  timestamp: string;
}

export class ServiceRequestAssignmentRepository extends AbstractRepository<ServiceRequestAssignmentEntity> {
  async create(entity: Omit<ServiceRequestAssignmentEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceRequestAssignmentEntity> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newAsgn: ServiceRequestAssignmentEntity = {
      ...entity,
      id,
      createdAt: now,
      updatedAt: now
    };

    logger.info(`Repository: Saving service request assignment ${id} for requestId ${newAsgn.requestId}`);
    const sql = `
      INSERT INTO service_request_assignments (
        id, requestId, assignedEngineerId, assignedEngineerName, assignedBy,
        assignmentDate, targetResolutionDate, remarks, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbPool.query(sql, [
      newAsgn.id, newAsgn.requestId, newAsgn.assignedEngineerId, newAsgn.assignedEngineerName, newAsgn.assignedBy,
      newAsgn.assignmentDate, newAsgn.targetResolutionDate, newAsgn.remarks, newAsgn.createdAt, newAsgn.updatedAt
    ]);

    return newAsgn;
  }

  async findById(id: string): Promise<ServiceRequestAssignmentEntity | null> {
    const sql = `SELECT * FROM service_request_assignments WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? (rows[0] as ServiceRequestAssignmentEntity) : null;
  }

  async findByRequestId(requestId: string): Promise<ServiceRequestAssignmentEntity | null> {
    const sql = `SELECT * FROM service_request_assignments WHERE requestId = ?`;
    const rows = await dbPool.query(sql, [requestId]);
    return rows.length > 0 ? (rows[0] as ServiceRequestAssignmentEntity) : null;
  }

  async findAll(options?: QueryOptions): Promise<{ data: ServiceRequestAssignmentEntity[]; total: number }> {
    const limit = options?.limit ?? 100;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'createdAt';
    const sortOrder = options?.sortOrder ?? 'DESC';

    let whereClause = '1=1';
    const params: any[] = [];

    if (options?.filters?.requestId) {
      whereClause += ' AND requestId = ?';
      params.push(options.filters.requestId);
    }

    const countSql = `SELECT COUNT(*) as total FROM service_request_assignments WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM service_request_assignments 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;

    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;

    const queryParams = [...params, limit, offset];
    const data = (await dbPool.query(selectSql, queryParams)) as ServiceRequestAssignmentEntity[];

    return { data, total };
  }

  async update(id: string, entity: Partial<ServiceRequestAssignmentEntity>): Promise<ServiceRequestAssignmentEntity> {
    logger.info(`Repository: Updating service request assignment ${id}`);
    const original = await this.findById(id);
    if (!original) {
      throw new Error(`Service request assignment with ID ${id} not found`);
    }

    const keys = Object.keys(entity).filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const params = keys.map(key => (entity as any)[key]);

    const now = new Date().toISOString();
    if (keys.length > 0) {
      const sql = `UPDATE service_request_assignments SET ${setClause}, updatedAt = ? WHERE id = ?`;
      await dbPool.query(sql, [...params, now, id]);
    }

    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<boolean> {
    logger.info(`Repository: Deleting service request assignment ${id}`);
    const sql = `DELETE FROM service_request_assignments WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }

  // AUDIT LOGS FOR WORKFLOW FLOW PROGRESSIONS
  async createAuditLog(log: Omit<ServiceRequestAuditLogEntity, 'id' | 'timestamp'>): Promise<ServiceRequestAuditLogEntity> {
    const id = uuidv4();
    const timestamp = new Date().toISOString();
    const newLog: ServiceRequestAuditLogEntity = { ...log, id, timestamp };

    const sql = `
      INSERT INTO service_request_audit_logs (
        id, requestId, action, fromStatus, toStatus, performedBy, performedByRole, notes, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbPool.query(sql, [
      newLog.id, newLog.requestId, newLog.action, newLog.fromStatus, newLog.toStatus,
      newLog.performedBy, newLog.performedByRole, newLog.notes, newLog.timestamp
    ]);

    return newLog;
  }

  async findAuditLogsByRequestId(requestId: string): Promise<ServiceRequestAuditLogEntity[]> {
    const sql = `SELECT * FROM service_request_audit_logs WHERE requestId = ? ORDER BY timestamp DESC`;
    const rows = await dbPool.query(sql, [requestId]);
    return rows as ServiceRequestAuditLogEntity[];
  }
}

export const serviceRequestAssignmentRepository = new ServiceRequestAssignmentRepository();
