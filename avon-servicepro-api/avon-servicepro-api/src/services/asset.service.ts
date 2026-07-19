import { assetRepository, AssetEntity } from '../repositories/asset.repository';
import { auditRepository } from '../repositories/audit.repository';
import { logger } from '../config/logger';
import { BadRequestError, NotFoundError } from '../utils/apiError';

export class AssetService {
  async registerAsset(assetData: Omit<AssetEntity, 'id' | 'serviceHistoryCount' | 'repairHistoryCount' | 'totalRevenueGenerated'>, userId: string, userName: string, userRole: string): Promise<AssetEntity> {
    logger.info(`AssetService: Registering new asset serial ${assetData.serialNumber}`);

    const existing = await assetRepository.findBySerialNumber(assetData.serialNumber);
    if (existing) {
      throw new BadRequestError(`An instrument asset with Serial Number ${assetData.serialNumber} is already registered.`);
    }

    const asset = await assetRepository.create({
      ...assetData,
      serviceHistoryCount: 0,
      repairHistoryCount: 0,
      totalRevenueGenerated: 0
    });

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action: 'ADD_ASSET',
      newValue: asset.id,
      remarks: `Registered medical instrument ${asset.brand} ${asset.model} (Serial: ${asset.serialNumber}) into workspace inventory.`
    });

    return asset;
  }

  async getAsset(id: string): Promise<AssetEntity> {
    const asset = await assetRepository.findById(id);
    if (!asset) {
      throw new NotFoundError(`Instrument asset with ID ${id} not found`);
    }
    return asset;
  }

  async updateAsset(id: string, updates: Partial<AssetEntity>, userId: string, userName: string, userRole: string): Promise<AssetEntity> {
    logger.info(`AssetService: Updating asset ${id}`);
    
    const original = await assetRepository.findById(id);
    if (!original) {
      throw new NotFoundError(`Instrument asset with ID ${id} not found`);
    }

    const updated = await assetRepository.update(id, updates);

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action: 'UPDATE_ASSET',
      remarks: `Updated specifications or warranty terms of asset ${updated.serialNumber}.`
    });

    return updated;
  }
}

export const assetService = new AssetService();
export default assetService;
