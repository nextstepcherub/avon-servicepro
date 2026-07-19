import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: string;
  tags: string; // JSON string of tags array in DB
  avatarUrl?: string;
  territory?: string;
  passwordHash: string;
}

export class UserRepository extends AbstractRepository<UserEntity> {
  async create(entity: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    const id = uuidv4();
    const newUser: UserEntity = { ...entity, id };
    
    logger.info(`Repository: Saving user ${id} (${newUser.email}) into user_profiles table`);
    const sql = `
      INSERT INTO user_profiles (
        id, name, email, role, tags, avatarUrl, territory, passwordHash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await dbPool.query(sql, [
      newUser.id, newUser.name, newUser.email, newUser.role, newUser.tags,
      newUser.avatarUrl, newUser.territory, newUser.passwordHash
    ]);
    
    return newUser;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const sql = `SELECT * FROM user_profiles WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? rows[0] as UserEntity : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const sql = `SELECT * FROM user_profiles WHERE email = ?`;
    const rows = await dbPool.query(sql, [email]);
    return rows.length > 0 ? rows[0] as UserEntity : null;
  }

  async findAll(options?: QueryOptions): Promise<{ data: UserEntity[]; total: number }> {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'name';
    const sortOrder = options?.sortOrder ?? 'ASC';
    
    let whereClause = '1=1';
    const params: any[] = [];
    
    if (options?.search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ? OR territory LIKE ?)';
      const searchPattern = `%${options.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    if (options?.filters?.role) {
      whereClause += ' AND role = ?';
      params.push(options.filters.role);
    }
    
    const countSql = `SELECT COUNT(*) as total FROM user_profiles WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM user_profiles 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;
    
    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;
    
    const data = await dbPool.query(selectSql, [...params, limit, offset]) as UserEntity[];
    return { data, total };
  }

  async update(id: string, entity: Partial<UserEntity>): Promise<UserEntity> {
    const keys = Object.keys(entity).filter(key => key !== 'id');
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const params = keys.map(key => (entity as any)[key]);
    
    if (keys.length > 0) {
      const sql = `UPDATE user_profiles SET ${setClause} WHERE id = ?`;
      await dbPool.query(sql, [...params, id]);
    }
    
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM user_profiles WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }
}

export const userRepository = new UserRepository();
