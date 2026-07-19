import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface InstallationAssignmentEntity {
  id: string;
  requestId: string;
  assignedEngineer: string;
  assignedTechnicians: string; // JSON array or string
  assignedBy: string;
  assignmentDate: string;
  targetInstallationDate: string;
  priority: string;
  slaDaysSetting: number;
  slaDueDate: string;
  installationTerritory: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstallationAssignmentAuditLogEntity {
  id: string;
  requestId: string;
  assignmentId?: string;
  action: string;
  fromStatus?: string;
  toStatus: string;
  performedBy: string;
  performedByRole: string;
  notes?: string;
  timestamp: string;
}

export class InstallationAssignmentRepository extends AbstractRepository<InstallationAssignmentEntity> {
  async create(entity: Omit<InstallationAssignmentEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<InstallationAssignmentEntity> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newAsgn: InstallationAssignmentEntity = {
      ...entity,
      id,
      createdAt: now,
      updatedAt: now
    };

    logger.info(`Repository: Saving installation assignment ${id} for requestId ${newAsgn.requestId}`);
    const sql = `
      INSERT INTO installation_assignments (
        id, requestId, assignedEngineer, assignedTechnicians, assignedBy,
        assignmentDate, targetInstallationDate, priority, slaDaysSetting,
        slaDueDate, installationTerritory, remarks, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbPool.query(sql, [
      newAsgn.id, newAsgn.requestId, newAsgn.assignedEngineer, newAsgn.assignedTechnicians, newAsgn.assignedBy,
      newAsgn.assignmentDate, newAsgn.targetInstallationDate, newAsgn.priority, newAsgn.slaDaysSetting,
      newAsgn.slaDueDate, newAsgn.installationTerritory, newAsgn.remarks, newAsgn.createdAt, newAsgn.updatedAt
    ]);

    return newAsgn;
  }

  async findById(id: string): Promise<InstallationAssignmentEntity | null> {
    const sql = `SELECT * FROM installation_assignments WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? (rows[0] as InstallationAssignmentEntity) : null;
  }

  async findByRequestId(requestId: string): Promise<InstallationAssignmentEntity | null> {
    const sql = `SELECT * FROM installation_assignments WHERE requestId = ?`;
    const rows = await dbPool.query(sql, [requestId]);
    return rows.length > 0 ? (rows[0] as InstallationAssignmentEntity) : null;
  }

  async findAll(options?: QueryOptions): Promise<{ data: InstallationAssignmentEntity[]; total: number }> {
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

    const countSql = `SELECT COUNT(*) as total FROM installation_assignments WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM installation_assignments 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;

    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;

    const queryParams = [...params, limit, offset];
    const data = (await dbPool.query(selectSql, queryParams)) as InstallationAssignmentEntity[];

    return { data, total };
  }

  async update(id: string, entity: Partial<InstallationAssignmentEntity>): Promise<InstallationAssignmentEntity> {
    logger.info(`Repository: Updating installation assignment ${id}`);
    const original = await this.findById(id);
    if (!original) {
      throw new Error(`Installation assignment with ID ${id} not found`);
    }

    const keys = Object.keys(entity).filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const params = keys.map(key => (entity as any)[key]);

    const now = new Date().toISOString();
    if (keys.length > 0) {
      const sql = `UPDATE installation_assignments SET ${setClause}, updatedAt = ? WHERE id = ?`;
      await dbPool.query(sql, [...params, now, id]);
    }

    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM installation_assignments WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }

  // Audit Logs Methods
  async createAuditLog(log: Omit<InstallationAssignmentAuditLogEntity, 'id' | 'timestamp'>): Promise<InstallationAssignmentAuditLogEntity> {
    const id = uuidv4();
    const timestamp = new Date().toISOString();
    const newLog: InstallationAssignmentAuditLogEntity = { ...log, id, timestamp };

    const sql = `
      INSERT INTO installation_assignment_audit_logs (
        id, requestId, assignmentId, action, fromStatus, toStatus, performedBy, performedByRole, notes, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbPool.query(sql, [
      newLog.id, newLog.requestId, newLog.assignmentId, newLog.action, newLog.fromStatus, newLog.toStatus,
      newLog.performedBy, newLog.performedByRole, newLog.notes, newLog.timestamp
    ]);

    return newLog;
  }

  async findAuditLogsByRequestId(requestId: string): Promise<InstallationAssignmentAuditLogEntity[]> {
    const sql = `SELECT * FROM installation_assignment_audit_logs WHERE requestId = ? ORDER BY timestamp DESC`;
    const rows = await dbPool.query(sql, [requestId]);
    return rows as InstallationAssignmentAuditLogEntity[];
  }

  async findAuditLogsAll(): Promise<InstallationAssignmentAuditLogEntity[]> {
    const sql = `SELECT * FROM installation_assignment_audit_logs ORDER BY timestamp DESC`;
    const rows = await dbPool.query(sql);
    return rows as InstallationAssignmentAuditLogEntity[];
  }
}

export const installationAssignmentRepository = new InstallationAssignmentRepository();
