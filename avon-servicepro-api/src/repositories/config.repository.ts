import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface SystemSettingEntity {
  id: string;
  key: string;
  value: string;
  category: string;
  updatedAt: string;
}

export interface ConfigurationEntity {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isEncrypted: boolean;
  updatedAt: string;
}

export interface VersionControlEntity {
  id: string;
  appVersion: string;
  apiVersion: string;
  releaseDate: string;
  status: 'ACTIVE' | 'DEPRECATED' | 'DEVELOPMENT';
  changelog?: string;
  createdAt: string;
}

export interface LookupDataEntity {
  id: string;
  type: string;
  code: string;
  value: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export class SystemSettingsRepository {
  async findByKey(key: string): Promise<SystemSettingEntity | null> {
    const sql = 'SELECT * FROM system_settings WHERE `key` = ?';
    const rows = await dbPool.query(sql, [key]);
    return rows.length > 0 ? (rows[0] as SystemSettingEntity) : null;
  }

  async findAll(): Promise<SystemSettingEntity[]> {
    const sql = 'SELECT * FROM system_settings ORDER BY category, `key`';
    return await dbPool.query(sql);
  }

  async upsert(key: string, value: string, category: string): Promise<SystemSettingEntity> {
    const existing = await this.findByKey(key);
    const nowStr = new Date().toISOString();

    if (existing) {
      const sql = 'UPDATE system_settings SET value = ?, category = ?, updatedAt = ? WHERE `key` = ?';
      await dbPool.query(sql, [value, category, nowStr, key]);
      return { ...existing, value, category, updatedAt: nowStr };
    } else {
      const id = uuidv4();
      const sql = 'INSERT INTO system_settings (id, `key`, value, category, updatedAt) VALUES (?, ?, ?, ?, ?)';
      await dbPool.query(sql, [id, key, value, category, nowStr]);
      return { id, key, value, category, updatedAt: nowStr };
    }
  }
}

export class ConfigurationsRepository {
  async findByKey(key: string): Promise<ConfigurationEntity | null> {
    const sql = 'SELECT * FROM configurations WHERE `key` = ?';
    const rows = await dbPool.query(sql, [key]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      ...row,
      isEncrypted: !!row.isEncrypted,
    } as ConfigurationEntity;
  }

  async findAll(): Promise<ConfigurationEntity[]> {
    const sql = 'SELECT * FROM configurations ORDER BY `key`';
    const rows = await dbPool.query(sql);
    return rows.map((r: any) => ({
      ...r,
      isEncrypted: !!r.isEncrypted,
    })) as ConfigurationEntity[];
  }

  async upsert(
    key: string,
    value: string,
    type: 'string' | 'number' | 'boolean' | 'json',
    description?: string,
    isEncrypted = false
  ): Promise<ConfigurationEntity> {
    const existing = await this.findByKey(key);
    const nowStr = new Date().toISOString();

    if (existing) {
      const sql = 'UPDATE configurations SET value = ?, type = ?, description = ?, isEncrypted = ?, updatedAt = ? WHERE `key` = ?';
      await dbPool.query(sql, [value, type, description || null, isEncrypted ? 1 : 0, nowStr, key]);
      return { ...existing, value, type, description, isEncrypted, updatedAt: nowStr };
    } else {
      const id = uuidv4();
      const sql = 'INSERT INTO configurations (id, `key`, value, type, description, isEncrypted, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)';
      await dbPool.query(sql, [id, key, value, type, description || null, isEncrypted ? 1 : 0, nowStr]);
      return { id, key, value, type, description, isEncrypted, updatedAt: nowStr };
    }
  }
}

export class VersionControlRepository {
  async findById(id: string): Promise<VersionControlEntity | null> {
    const sql = 'SELECT * FROM version_control WHERE id = ?';
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? (rows[0] as VersionControlEntity) : null;
  }

  async findAll(): Promise<VersionControlEntity[]> {
    const sql = 'SELECT * FROM version_control ORDER BY appVersion DESC, releaseDate DESC';
    return await dbPool.query(sql);
  }

  async create(entity: Omit<VersionControlEntity, 'id' | 'createdAt'>): Promise<VersionControlEntity> {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const sql = 'INSERT INTO version_control (id, appVersion, apiVersion, releaseDate, status, changelog, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await dbPool.query(sql, [id, entity.appVersion, entity.apiVersion, entity.releaseDate, entity.status, entity.changelog || null, createdAt]);
    return { id, ...entity, createdAt };
  }

  async update(id: string, updates: Partial<Omit<VersionControlEntity, 'id' | 'createdAt'>>): Promise<VersionControlEntity> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Version control entry with ID '${id}' not found`);
    }

    const fieldsToUpdate: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        fieldsToUpdate.push(`\`${key}\` = ?`);
        values.push(value);
      }
    });

    if (fieldsToUpdate.length > 0) {
      const sql = `UPDATE version_control SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
      values.push(id);
      await dbPool.query(sql, values);
    }

    return { ...existing, ...updates } as VersionControlEntity;
  }

  async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM version_control WHERE id = ?';
    const result = await dbPool.query(sql, [id]);
    return true;
  }
}

export class LookupDataRepository {
  async findById(id: string): Promise<LookupDataEntity | null> {
    const sql = 'SELECT * FROM lookup_data WHERE id = ?';
    const rows = await dbPool.query(sql, [id]);
    if (rows.length === 0) return null;
    return { ...rows[0], isActive: !!rows[0].isActive } as LookupDataEntity;
  }

  async findByTypeAndCode(type: string, code: string): Promise<LookupDataEntity | null> {
    const sql = 'SELECT * FROM lookup_data WHERE type = ? AND code = ?';
    const rows = await dbPool.query(sql, [type, code]);
    if (rows.length === 0) return null;
    return { ...rows[0], isActive: !!rows[0].isActive } as LookupDataEntity;
  }

  async findAll(options?: { type?: string; isActiveOnly?: boolean }): Promise<LookupDataEntity[]> {
    let sql = 'SELECT * FROM lookup_data';
    const params: any[] = [];
    const conditions: string[] = [];

    if (options?.type) {
      conditions.push('type = ?');
      params.push(options.type);
    }

    if (options?.isActiveOnly) {
      conditions.push('isActive = 1');
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY type, sortOrder, value';
    const rows = await dbPool.query(sql, params);
    return rows.map((r: any) => ({ ...r, isActive: !!r.isActive })) as LookupDataEntity[];
  }

  async create(entity: Omit<LookupDataEntity, 'id' | 'createdAt'>): Promise<LookupDataEntity> {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const sql = 'INSERT INTO lookup_data (id, type, code, value, isActive, sortOrder, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await dbPool.query(sql, [id, entity.type, entity.code.trim().toUpperCase(), entity.value, entity.isActive ? 1 : 0, entity.sortOrder, createdAt]);
    return { id, ...entity, createdAt };
  }

  async update(id: string, updates: Partial<Omit<LookupDataEntity, 'id' | 'createdAt'>>): Promise<LookupDataEntity> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Lookup data with ID '${id}' not found`);
    }

    const fieldsToUpdate: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        fieldsToUpdate.push(`\`${key}\` = ?`);
        if (key === 'isActive') {
          values.push(value ? 1 : 0);
        } else if (key === 'code') {
          values.push((value as string).trim().toUpperCase());
        } else {
          values.push(value);
        }
      }
    });

    if (fieldsToUpdate.length > 0) {
      const sql = `UPDATE lookup_data SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
      values.push(id);
      await dbPool.query(sql, values);
    }

    return { ...existing, ...updates } as LookupDataEntity;
  }

  async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM lookup_data WHERE id = ?';
    await dbPool.query(sql, [id]);
    return true;
  }
}

export const systemSettingsRepository = new SystemSettingsRepository();
export const configurationsRepository = new ConfigurationsRepository();
export const versionControlRepository = new VersionControlRepository();
export const lookupDataRepository = new LookupDataRepository();
