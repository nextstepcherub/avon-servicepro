import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface CustomerEntity {
  id: string;
  name: string;
  departments: string; // JSON string in DB
  endUsers: string; // JSON string in DB
  installedEquipmentCount: number;
  totalRevenue: number;
  activeContracts: number;
  feedbackNpsAverage: number;
  contracts?: string; // JSON string in DB
}

export class CustomerRepository extends AbstractRepository<CustomerEntity> {
  async create(entity: Omit<CustomerEntity, 'id'>): Promise<CustomerEntity> {
    const id = uuidv4();
    const newCustomer: CustomerEntity = { ...entity, id };
    
    logger.info(`Repository: Saving customer ${id} into customers table`);
    const sql = `
      INSERT INTO customer_profiles (
        id, name, departments, endUsers, installedEquipmentCount,
        totalRevenue, activeContracts, feedbackNpsAverage, contracts
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await dbPool.query(sql, [
      newCustomer.id, newCustomer.name, newCustomer.departments, newCustomer.endUsers,
      newCustomer.installedEquipmentCount, newCustomer.totalRevenue, newCustomer.activeContracts,
      newCustomer.feedbackNpsAverage, newCustomer.contracts
    ]);
    
    return newCustomer;
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const sql = `SELECT * FROM customer_profiles WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? rows[0] as CustomerEntity : null;
  }

  async findByName(name: string): Promise<CustomerEntity | null> {
    const sql = `SELECT * FROM customer_profiles WHERE name = ?`;
    const rows = await dbPool.query(sql, [name]);
    return rows.length > 0 ? rows[0] as CustomerEntity : null;
  }

  async findAll(options?: QueryOptions): Promise<{ data: CustomerEntity[]; total: number }> {
    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'name';
    const sortOrder = options?.sortOrder ?? 'ASC';
    
    let whereClause = '1=1';
    const params: any[] = [];
    
    if (options?.search) {
      whereClause += ' AND (name LIKE ?)';
      params.push(`%${options.search}%`);
    }
    
    const countSql = `SELECT COUNT(*) as total FROM customer_profiles WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM customer_profiles 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;
    
    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;
    
    const data = await dbPool.query(selectSql, [...params, limit, offset]) as CustomerEntity[];
    return { data, total };
  }

  async update(id: string, entity: Partial<CustomerEntity>): Promise<CustomerEntity> {
    const keys = Object.keys(entity).filter(key => key !== 'id');
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const params = keys.map(key => (entity as any)[key]);
    
    if (keys.length > 0) {
      const sql = `UPDATE customer_profiles SET ${setClause} WHERE id = ?`;
      await dbPool.query(sql, [...params, id]);
    }
    
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM customer_profiles WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }
}

export const customerRepository = new CustomerRepository();
