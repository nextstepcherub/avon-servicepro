import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class AssetRepository {
  async create(data: any): Promise<any> {
    const id = data.id || `ast-${uuidv4()}`;
    const asset = {
      id,
      ...data,
      createdAt: new Date().toISOString()
    };
    await dbPool.query(
      `INSERT INTO instrument_assets (
        id, assetNumber, serialNumber, brand, model, description,
        warrantyPeriodMonths, customerName, department, serviceHistoryCount,
        repairHistoryCount, totalRevenueGenerated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, asset.assetNumber, asset.serialNumber, asset.brand, asset.model, asset.description,
        asset.warrantyPeriodMonths, asset.customerName, asset.department, asset.serviceHistoryCount,
        asset.repairHistoryCount, asset.totalRevenueGenerated
      ]
    );
    return asset;
  }

  async findBySerialNumber(serialNumber: string): Promise<any> {
    const rows = await dbPool.query('SELECT * FROM instrument_assets WHERE serialNumber = ?', [serialNumber]);
    return rows && rows.length > 0 ? rows[0] : null;
  }
}

export const assetRepository = new AssetRepository();
