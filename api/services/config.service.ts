import {
  configurationsRepository,
  lookupDataRepository,
} from '../repositories/config.repository';

export class ConfigService {
  async updateConfiguration(key: string, value: string, type: string) {
    if (type === 'number') {
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error(`Configuration key ${key} requires a valid numeric value`);
      }
    }
    return await configurationsRepository.upsert(key, value, type);
  }

  async createLookupItem(data: any) {
    const code = (data.code || '').trim().toUpperCase();
    const existing = await lookupDataRepository.findByTypeAndCode(data.type, code);
    if (existing) {
      throw new Error(`Lookup item of type ${data.type} with code ${code} already exists`);
    }
    return { id: 'new_lookup', ...data, code };
  }
}

export const configService = new ConfigService();
