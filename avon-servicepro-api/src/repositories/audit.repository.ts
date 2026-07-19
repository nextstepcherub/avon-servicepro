import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { getRequestContext } from '../utils/requestContext';

export interface AuditLogEntity {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  previousValue?: string;
  newValue?: string;
  remarks?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditRepository extends AbstractRepository<AuditLogEntity> {
  async create(entity: Omit<AuditLogEntity, 'id'>): Promise<AuditLogEntity> {
    const id = uuidv4();
    const context = getRequestContext();
    const ipAddress = entity.ipAddress || context?.ipAddress || '127.0.0.1';
    const userAgent = entity.userAgent || context?.userAgent || 'System / Direct';

    const newLog: AuditLogEntity = { ...entity, id, ipAddress, userAgent };
    
    // Low level logging
    logger.debug(`Audit Logging triggered: [${newLog.action}] by ${newLog.userName} from ${newLog.ipAddress}`);
    
    const sql = `
      INSERT INTO audit_logs (
        id, timestamp, userId, userName, userRole, action, previousValue, newValue, remarks, ipAddress, userAgent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await dbPool.query(sql, [
      newLog.id, newLog.timestamp, newLog.userId, newLog.userName, newLog.userRole,
      newLog.action, newLog.previousValue, newLog.newValue, newLog.remarks,
      newLog.ipAddress, newLog.userAgent
    ]);
    
    return newLog;
  }

  async findById(id: string): Promise<AuditLogEntity | null> {
    const sql = `SELECT * FROM audit_logs WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? rows[0] as AuditLogEntity : null;
  }

  async findAll(options?: QueryOptions): Promise<{ data: AuditLogEntity[]; total: number }> {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'timestamp';
    const sortOrder = options?.sortOrder ?? 'DESC';
    
    let whereClause = '1=1';
    const params: any[] = [];
    
    if (options?.search) {
      whereClause += ' AND (userName LIKE ? OR action LIKE ? OR remarks LIKE ? OR ipAddress LIKE ?)';
      const searchPattern = `%${options.search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }
    
    if (options?.filters?.userId) {
      whereClause += ' AND userId = ?';
      params.push(options.filters.userId);
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

  // Not typically supported for audit trails (immutable logs), but satisfies interface
  async update(id: string, _entity: Partial<AuditLogEntity>): Promise<AuditLogEntity> {
    logger.error('Security alert: Attempt to modify immutable audit trail record!');
    throw new Error('Audit trail records are immutable and cannot be modified.');
  }

  // Not supported for compliance
  async delete(_id: string): Promise<boolean> {
    logger.error('Security alert: Attempt to delete audit log record!');
    throw new Error('Audit trail records are immutable and cannot be deleted.');
  }
}

export const auditRepository = new AuditRepository();
export default auditRepository;
