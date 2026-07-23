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
    const user_id = entity.user_id || entity.userId || context?.userId || null;
    const ip_address = entity.ip_address || entity.ipAddress || context?.ipAddress || '127.0.0.1';
    const audit_no = entity.audit_no || `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const event_time = entity.event_time || new Date();
    const module = entity.module || 'SYSTEM';
    const entity_name = entity.entity_name || 'UNKNOWN';
    const entity_id = entity.entity_id || null;
    const action = entity.action || 'OTHER';
    const description = entity.description || entity.remarks || '';
    const success = entity.success !== undefined ? entity.success : 1;
    const remarks = entity.remarks || '';
    const company_id = entity.company_id || null;

    logger.debug(`Audit Logging triggered: [${action}] by user ${user_id} from ${ip_address}`);

    const sql = `
      INSERT INTO audit_logs (
        id, audit_no, event_time, user_id, company_id, module, entity_name, entity_id, action, description, success, remarks, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbPool.query(sql, [
      id, audit_no, event_time, user_id, company_id, module, entity_name, entity_id, action, description, success, remarks, ip_address
    ]);

    const result: AuditLogEntity = {
      id,
      audit_no,
      event_time,
      user_id,
      company_id,
      module,
      entity_name,
      entity_id,
      action,
      description,
      success,
      remarks,
      ip_address,
      
      // Compatibility fields so no consumers break
      userId: user_id || undefined,
      ipAddress: ip_address,
      userAgent: entity.userAgent || 'System'
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
    const sortBy = options?.sortBy ?? 'event_time';
    const sortOrder = options?.sortOrder ?? 'DESC';

    let whereClause = '1=1';
    const params: any[] = [];

    if (options?.search) {
      whereClause += ' AND (action LIKE ? OR remarks LIKE ? OR ip_address LIKE ? OR description LIKE ?)';
      const searchPattern = `%${options.search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (options?.filters?.user_id || options?.filters?.userId) {
      whereClause += ' AND user_id = ?';
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
    logger.error('Security alert: Attempt to modify immutable audit trail record!');
    throw new Error('Audit trail records are immutable and cannot be modified.');
  }

  async delete(_id: string): Promise<boolean> {
    logger.error('Security alert: Attempt to delete audit log record!');
    throw new Error('Audit trail records are immutable and cannot be deleted.');
  }
}

export const auditRepository = new AuditRepository();
export default auditRepository;
