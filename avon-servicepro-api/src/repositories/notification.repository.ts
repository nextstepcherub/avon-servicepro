import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface NotificationEntity {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  createdAt: string;
  readAt?: string;
  link?: string;
}

export class NotificationRepository extends AbstractRepository<NotificationEntity> {
  async create(entity: Omit<NotificationEntity, 'id'>): Promise<NotificationEntity> {
    const id = uuidv4();
    const newNotif: NotificationEntity = {
      ...entity,
      id,
      status: entity.status || 'UNREAD',
      createdAt: entity.createdAt || new Date().toISOString()
    };
    
    logger.debug(`Notification created: [${newNotif.title}] for User ${newNotif.userId}`);
    
    const sql = `
      INSERT INTO notifications (
        id, userId, title, message, type, priority, status, createdAt, readAt, link
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await dbPool.query(sql, [
      newNotif.id,
      newNotif.userId,
      newNotif.title,
      newNotif.message,
      newNotif.type,
      newNotif.priority,
      newNotif.status,
      newNotif.createdAt,
      newNotif.readAt || null,
      newNotif.link || null
    ]);
    
    return newNotif;
  }

  async findById(id: string): Promise<NotificationEntity | null> {
    const sql = `SELECT * FROM notifications WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? rows[0] as NotificationEntity : null;
  }

  async findAll(options?: QueryOptions): Promise<{ data: NotificationEntity[]; total: number }> {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'createdAt';
    const sortOrder = options?.sortOrder ?? 'DESC';
    
    let whereClause = '1=1';
    const params: any[] = [];
    
    if (options?.search) {
      whereClause += ' AND (title LIKE ? OR message LIKE ?)';
      const searchPattern = `%${options.search}%`;
      params.push(searchPattern, searchPattern);
    }
    
    if (options?.filters?.userId) {
      whereClause += ' AND userId = ?';
      params.push(options.filters.userId);
    }

    if (options?.filters?.status) {
      whereClause += ' AND status = ?';
      params.push(options.filters.status);
    }

    if (options?.filters?.type) {
      whereClause += ' AND type = ?';
      params.push(options.filters.type);
    }
    
    const countSql = `SELECT COUNT(*) as total FROM notifications WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM notifications 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;
    
    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;
    
    const data = await dbPool.query(selectSql, [...params, limit, offset]) as NotificationEntity[];
    return { data, total };
  }

  async update(id: string, entity: Partial<NotificationEntity>): Promise<NotificationEntity> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Notification record with id ${id} not found.`);
    }

    const updated = { ...existing, ...entity };

    const keys = Object.keys(entity).filter(k => k !== 'id');
    if (keys.length === 0) return updated;

    const setClause = keys.map(k => `\`${k}\` = ?`).join(', ');
    const params = keys.map(k => (entity as any)[k]);

    const sql = `UPDATE notifications SET ${setClause} WHERE id = ?`;
    await dbPool.query(sql, [...params, id]);

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM notifications WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const sql = `UPDATE notifications SET status = 'READ', readAt = ? WHERE userId = ? AND status = 'UNREAD'`;
    await dbPool.query(sql, [new Date().toISOString(), userId]);
    return true;
  }
}

export const notificationRepository = new NotificationRepository();
export default notificationRepository;
