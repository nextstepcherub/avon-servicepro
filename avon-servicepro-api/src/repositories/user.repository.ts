import { dbPool } from '../config/database';
import { logger } from '../config/logger';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: string;
  tags: string; // JSON string of tags array in DB
  avatarUrl?: string;
  territory?: string;
}

export class UserRepository {
  async findById(id: string): Promise<UserEntity | null> {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? rows[0] as UserEntity : null;
  }

  async findProfile(id: string): Promise<UserEntity | null> {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? rows[0] as UserEntity : null;
  }

  async updateProfile(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const keys = Object.keys(data).filter(key => key !== 'id');
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const params = keys.map(key => (data as any)[key]);
    
    if (keys.length > 0) {
      const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
      await dbPool.query(sql, [...params, id]);
    }
    
    const updated = await this.findById(id);
    return updated!;
  }

  async updateLastLogin(id: string): Promise<void> {
    const sql = `UPDATE users SET last_login = ? WHERE id = ?`;
    await dbPool.query(sql, [new Date(), id]);
  }

  async setActive(id: string, active: boolean): Promise<void> {
    const activeVal = active ? 1 : 0;
    const sql = `UPDATE users SET active = ? WHERE id = ?`;
    await dbPool.query(sql, [activeVal, id]);
  }
}

export const userRepository = new UserRepository();
