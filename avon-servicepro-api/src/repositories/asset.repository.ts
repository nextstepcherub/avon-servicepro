import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface AssetEntity {
  id: string;
  assetNumber: string;
  serialNumber: string;
  brand: string;
  model: string;
  description: string;
  invoiceNumber?: string;
  invoiceValue?: number;
  warrantyPeriodMonths: number;
  installationDate?: string;
  customerName: string;
  department: string;
  endUserName?: string;
  endUserContact?: string;
  endUserLocation?: string;
  warrantyCardNumber?: string;
  nextServiceInterval?: string;
  nextServiceDate?: string;
  lastPmDate?: string;
  nextPmDate?: string;
  amcStatus?: string;
  calibrationDue?: string;
  serviceHistoryCount: number;
  repairHistoryCount: number;
  totalRevenueGenerated: number;
}

export class AssetRepository extends AbstractRepository<AssetEntity> {
  async create(entity: Omit<AssetEntity, 'id'>): Promise<AssetEntity> {
    const id = uuidv4();
    const newAsset: AssetEntity = {
      description: '',
      warrantyPeriodMonths: 12,
      department: 'Laboratory',
      serviceHistoryCount: 0,
      repairHistoryCount: 0,
      totalRevenueGenerated: 0,
      ...entity,
      id
    };
    
    logger.info(`Repository: Saving asset ${id} into instruments table`);
    const sql = `
      INSERT INTO instrument_assets (
        id, assetNumber, serialNumber, brand, model, description, invoiceNumber,
        invoiceValue, warrantyPeriodMonths, installationDate, customerName, department,
        endUserName, endUserContact, endUserLocation, warrantyCardNumber,
        nextServiceInterval, nextServiceDate, lastPmDate, nextPmDate, amcStatus,
        calibrationDue, serviceHistoryCount, repairHistoryCount, totalRevenueGenerated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await dbPool.query(sql, [
      newAsset.id, newAsset.assetNumber, newAsset.serialNumber, newAsset.brand, newAsset.model,
      newAsset.description, newAsset.invoiceNumber, newAsset.invoiceValue, newAsset.warrantyPeriodMonths,
      newAsset.installationDate, newAsset.customerName, newAsset.department, newAsset.endUserName,
      newAsset.endUserContact, newAsset.endUserLocation, newAsset.warrantyCardNumber,
      newAsset.nextServiceInterval, newAsset.nextServiceDate, newAsset.lastPmDate, newAsset.nextPmDate,
      newAsset.amcStatus, newAsset.calibrationDue, newAsset.serviceHistoryCount,
      newAsset.repairHistoryCount, newAsset.totalRevenueGenerated
    ]);
    
    return newAsset;
  }

  async findById(id: string): Promise<AssetEntity | null> {
    const sql = `SELECT * FROM instrument_assets WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? rows[0] as AssetEntity : null;
  }

  async findBySerialNumber(serialNumber: string): Promise<AssetEntity | null> {
    const sql = `SELECT * FROM instrument_assets WHERE serialNumber = ?`;
    const rows = await dbPool.query(sql, [serialNumber]);
    return rows.length > 0 ? rows[0] as AssetEntity : null;
  }

  async findAll(options?: QueryOptions): Promise<{ data: AssetEntity[]; total: number }> {
    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'id';
    const sortOrder = options?.sortOrder ?? 'ASC';
    
    let whereClause = '1=1';
    const params: any[] = [];
    
    if (options?.search) {
      whereClause += ' AND (brand LIKE ? OR model LIKE ? OR serialNumber LIKE ? OR assetNumber LIKE ? OR customerName LIKE ?)';
      const searchPattern = `%${options.search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }
    
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value !== undefined && value !== '') {
          whereClause += ` AND ${key} = ?`;
          params.push(value);
        }
      }
    }
    
    const countSql = `SELECT COUNT(*) as total FROM instrument_assets WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM instrument_assets 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;
    
    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;
    
    const data = await dbPool.query(selectSql, [...params, limit, offset]) as AssetEntity[];
    return { data, total };
  }

  async update(id: string, entity: Partial<AssetEntity>): Promise<AssetEntity> {
    const keys = Object.keys(entity).filter(key => key !== 'id');
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const params = keys.map(key => (entity as any)[key]);
    
    if (keys.length > 0) {
      const sql = `UPDATE instrument_assets SET ${setClause} WHERE id = ?`;
      await dbPool.query(sql, [...params, id]);
    }
    
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM instrument_assets WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }
}

export const assetRepository = new AssetRepository();
