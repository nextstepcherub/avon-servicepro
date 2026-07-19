export class SystemSettingsRepository {}
export class ConfigurationsRepository {
  async upsert(key: string, value: string, type: string): Promise<any> {
    return { id: 'test', key, value, type, isEncrypted: false, updatedAt: new Date().toISOString() };
  }
}
export class VersionControlRepository {}
export class LookupDataRepository {
  async findByTypeAndCode(type: string, code: string): Promise<any> {
    return null;
  }
}

export const systemSettingsRepository = new SystemSettingsRepository();
export const configurationsRepository = new ConfigurationsRepository();
export const versionControlRepository = new VersionControlRepository();
export const lookupDataRepository = new LookupDataRepository();
