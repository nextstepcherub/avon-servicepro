import {
  systemSettingsRepository,
  configurationsRepository,
  versionControlRepository,
  lookupDataRepository,
  SystemSettingEntity,
  ConfigurationEntity,
  VersionControlEntity,
  LookupDataEntity,
} from '../repositories/config.repository';
import { logger } from '../config/logger';
import { BadRequestError, NotFoundError } from '../utils/apiError';

export class ConfigService {
  // --- SYSTEM SETTINGS ---
  async getSystemSettings(): Promise<SystemSettingEntity[]> {
    logger.info('ConfigService: Retrieving all system settings');
    return await systemSettingsRepository.findAll();
  }

  async updateSystemSetting(key: string, value: string, category: string): Promise<SystemSettingEntity> {
    logger.info(`ConfigService: Upserting system setting '${key}'`);
    if (!key || key.trim() === '') {
      throw new BadRequestError('Setting key cannot be empty');
    }
    return await systemSettingsRepository.upsert(key.trim(), value, category);
  }

  // --- CONFIGURATIONS ---
  async getConfigurations(): Promise<ConfigurationEntity[]> {
    logger.info('ConfigService: Retrieving all server configurations');
    return await configurationsRepository.findAll();
  }

  async updateConfiguration(
    key: string,
    value: string,
    type: 'string' | 'number' | 'boolean' | 'json',
    description?: string,
    isEncrypted = false
  ): Promise<ConfigurationEntity> {
    logger.info(`ConfigService: Upserting configuration '${key}'`);
    if (!key || key.trim() === '') {
      throw new BadRequestError('Configuration key cannot be empty');
    }

    // Validate type-specific structures
    if (type === 'number') {
      const num = Number(value);
      if (isNaN(num)) {
        throw new BadRequestError(`Configuration key '${key}' requires a valid numeric value`);
      }
    } else if (type === 'boolean') {
      if (value !== 'true' && value !== 'false') {
        throw new BadRequestError(`Configuration key '${key}' requires a 'true' or 'false' boolean string`);
      }
    } else if (type === 'json') {
      try {
        JSON.parse(value);
      } catch (e) {
        throw new BadRequestError(`Configuration key '${key}' requires a valid JSON-formatted string`);
      }
    }

    return await configurationsRepository.upsert(key.trim(), value, type, description, isEncrypted);
  }

  // --- VERSION CONTROL ---
  async getVersionControlHistory(): Promise<VersionControlEntity[]> {
    logger.info('ConfigService: Retrieving version control changelogs');
    return await versionControlRepository.findAll();
  }

  async createVersionEntry(data: {
    appVersion: string;
    apiVersion: string;
    releaseDate: string;
    status: 'ACTIVE' | 'DEPRECATED' | 'DEVELOPMENT';
    changelog?: string;
  }): Promise<VersionControlEntity> {
    logger.info(`ConfigService: Creating version control entry for App v${data.appVersion}`);
    if (!data.appVersion || data.appVersion.trim() === '') {
      throw new BadRequestError('Application version is required');
    }
    if (!data.apiVersion || data.apiVersion.trim() === '') {
      throw new BadRequestError('API version is required');
    }
    if (!data.releaseDate || data.releaseDate.trim() === '') {
      throw new BadRequestError('Release date is required');
    }
    return await versionControlRepository.create(data);
  }

  async updateVersionEntry(
    id: string,
    updates: {
      appVersion?: string;
      apiVersion?: string;
      releaseDate?: string;
      status?: 'ACTIVE' | 'DEPRECATED' | 'DEVELOPMENT';
      changelog?: string;
    }
  ): Promise<VersionControlEntity> {
    logger.info(`ConfigService: Updating version control entry '${id}'`);
    const existing = await versionControlRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Version control entry with ID '${id}' not found`);
    }
    return await versionControlRepository.update(id, updates);
  }

  async deleteVersionEntry(id: string): Promise<boolean> {
    logger.info(`ConfigService: Deleting version control entry '${id}'`);
    const existing = await versionControlRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Version control entry with ID '${id}' not found`);
    }
    return await versionControlRepository.delete(id);
  }

  // --- LOOKUP DATA ---
  async getLookupData(options?: { type?: string; isActiveOnly?: boolean }): Promise<LookupDataEntity[]> {
    logger.info(`ConfigService: Retrieving lookup data for: ${JSON.stringify(options)}`);
    return await lookupDataRepository.findAll(options);
  }

  async createLookupItem(data: {
    type: string;
    code: string;
    value: string;
    isActive?: boolean;
    sortOrder?: number;
  }): Promise<LookupDataEntity> {
    logger.info(`ConfigService: Registering lookup item type '${data.type}' code '${data.code}'`);
    if (!data.type || data.type.trim() === '') {
      throw new BadRequestError('Lookup group type is required');
    }
    if (!data.code || data.code.trim() === '') {
      throw new BadRequestError('Lookup item code is required');
    }
    if (!data.value || data.value.trim() === '') {
      throw new BadRequestError('Lookup item display value is required');
    }

    const trimmedCode = data.code.trim().toUpperCase();
    const existing = await lookupDataRepository.findByTypeAndCode(data.type, trimmedCode);
    if (existing) {
      throw new BadRequestError(`A lookup item under type '${data.type}' with code '${trimmedCode}' already exists`);
    }

    return await lookupDataRepository.create({
      type: data.type.trim(),
      code: trimmedCode,
      value: data.value.trim(),
      isActive: data.isActive !== undefined ? data.isActive : true,
      sortOrder: data.sortOrder || 0,
    });
  }

  async updateLookupItem(
    id: string,
    updates: {
      code?: string;
      value?: string;
      isActive?: boolean;
      sortOrder?: number;
    }
  ): Promise<LookupDataEntity> {
    logger.info(`ConfigService: Updating lookup item '${id}'`);
    const existing = await lookupDataRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Lookup item with ID '${id}' not found`);
    }

    if (updates.code) {
      const trimmedCode = updates.code.trim().toUpperCase();
      if (trimmedCode !== existing.code) {
        const codeConflict = await lookupDataRepository.findByTypeAndCode(existing.type, trimmedCode);
        if (codeConflict) {
          throw new BadRequestError(`A lookup item under type '${existing.type}' with code '${trimmedCode}' already exists`);
        }
      }
    }

    return await lookupDataRepository.update(id, updates);
  }

  async deleteLookupItem(id: string): Promise<boolean> {
    logger.info(`ConfigService: Deleting lookup item '${id}'`);
    const existing = await lookupDataRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Lookup item with ID '${id}' not found`);
    }
    return await lookupDataRepository.delete(id);
  }
}

export const configService = new ConfigService();
export default configService;
