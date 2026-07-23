import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { getRequestContext } from '../utils/requestContext';

export interface AuditLogEntity {
  id: string;
  audit_no?: string;
  event_time?: string | Date;
  user_id?: string | null;
  company_id?: string | null;
  module?: string;
  entity_name?: string;
  entity_id?: string | null;
  action: string;
  description?: string;
  success?: number;
  remarks?: string;
  ip_address?: string;
  created_at?: string | Date;

  // Compatibility fields for typescript files calling this repository with legacy properties
  timestamp?: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditRepository extends AbstractRepository<AuditLogEntity> {
  async create(entity: Omit<AuditLogEntity, 'id'>): Promise<AuditLogEntity> {
    const id = uuidv4();
    const context = getRequestContext();
    const timestamp = entity.timestamp || (entity.event_time ? String(entity.event_time) : new Date().toISOString());
    const userId = entity.userId || entity.user_id || context?.userId || 'system';
    const userName = entity.userName || entity.entity_name || 'System User';
    const userRole = entity.userRole || entity.module || 'System';
    const action = entity.action || 'OTHER';
    const previousValue = entity.previousValue || null;
    const newValue = entity.newValue || entity.entity_id || null;
    const remarks = entity.remarks || entity.description || '';
    const ipAddress = entity.ipAddress || entity.ip_address || context?.ipAddress || '127.0.0.1';
    const userAgent = entity.userAgent || 'System';

    logger.audit(`Audit Logged: [${action}] module=${userRole} entity=${userName}`, {
      user_id: userId,
      ip_address: ipAddress,
      action,
      entity_id: newValue,
      description: remarks,
    });

    const sql = `
      INSERT INTO audit_logs (
        id, timestamp, userid, username, userrole, action, previousvalue, newvalue, remarks, ipaddress, useragent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbPool.query(sql, [
      id, timestamp, userId, userName, userRole, action, previousValue, newValue, remarks, ipAddress, userAgent
    ]);

    const result: AuditLogEntity = {
      id,
      timestamp,
      userId,
      userName,
      userRole,
      action,
      previousValue,
      newValue,
      remarks,
      ipAddress,
      userAgent,
      event_time: timestamp,
      user_id: userId,
      ip_address: ipAddress,
      description: remarks
    };

    return result;
  }

  async findById(id: string): Promise<AuditLogEntity | null> {
    const sql = `SELECT * FROM audit_logs WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? rows[0] as AuditLogEntity : null;
  }

  async findAll(options?: QueryOptions): Promise<{ data: AuditLogEntity[]; total: number }> {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy && options.sortBy !== 'event_time' ? options.sortBy : 'timestamp';
    const sortOrder = options?.sortOrder ?? 'DESC';

    let whereClause = '1=1';
    const params: any[] = [];

    if (options?.search) {
      whereClause += ' AND (action LIKE ? OR remarks LIKE ? OR ipaddress LIKE ?)';
      const searchPattern = `%${options.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (options?.filters?.user_id || options?.filters?.userId) {
      whereClause += ' AND userid = ?';
      params.push(options.filters.user_id || options.filters.userId);
    }

    const countSql = `SELECT COUNT(*) as total FROM audit_logs WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM audit_logs 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;

    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;

    const data = await dbPool.query(selectSql, [...params, limit, offset]) as AuditLogEntity[];
    return { data, total };
  }

  async update(id: string, _entity: Partial<AuditLogEntity>): Promise<AuditLogEntity> {
    logger.security('Security alert: Attempt to modify immutable audit trail record!', { auditId: id });
    throw new Error('Audit trail records are immutable and cannot be modified.');
  }

  async delete(id: string): Promise<boolean> {
    logger.security('Security alert: Attempt to delete audit log record!', { auditId: id });
    throw new Error('Audit trail records are immutable and cannot be deleted.');
  }
}

export const auditRepository = new AuditRepository();
export default auditRepository;
