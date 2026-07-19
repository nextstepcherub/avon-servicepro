import { dbPool } from '../config/database';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';

export interface RefreshTokenEntity {
  id: string;
  token: string;
  userId: string;
  expiresAt: string; // ISO String
  createdAt: string; // ISO String
  revoked: boolean;
}

export class RefreshTokenRepository {
  // In-memory fallback in case of schema/DB issues
  private static fallbackStore = new Map<string, RefreshTokenEntity>();
  private useFallback = false;

  constructor() {
    // Check if fallback should be enabled based on pool initialization
  }

  async create(entity: Omit<RefreshTokenEntity, 'id' | 'createdAt' | 'revoked'>): Promise<RefreshTokenEntity> {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const newRecord: RefreshTokenEntity = {
      ...entity,
      id,
      createdAt,
      revoked: false,
    };

    if (this.useFallback) {
      RefreshTokenRepository.fallbackStore.set(newRecord.token, newRecord);
      return newRecord;
    }

    try {
      const sql = `
        INSERT INTO refresh_tokens (id, token, userId, expiresAt, createdAt, revoked)
        VALUES (?, ?, ?, ?, ?, 0)
      `;
      await dbPool.query(sql, [
        newRecord.id,
        newRecord.token,
        newRecord.userId,
        newRecord.expiresAt,
        newRecord.createdAt,
      ]);
      return newRecord;
    } catch (error) {
      logger.error(`RefreshTokenRepository: Create failed, falling back to in-memory store. Error: ${(error as Error).message}`);
      this.useFallback = true;
      RefreshTokenRepository.fallbackStore.set(newRecord.token, newRecord);
      return newRecord;
    }
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    if (this.useFallback) {
      const record = RefreshTokenRepository.fallbackStore.get(token);
      return record && !record.revoked ? record : null;
    }

    try {
      const sql = `SELECT * FROM refresh_tokens WHERE token = ? AND revoked = 0`;
      const rows = await dbPool.query(sql, [token]);
      if (rows.length === 0) return null;

      const row = rows[0];
      return {
        id: row.id,
        token: row.token,
        userId: row.userId,
        expiresAt: row.expiresAt,
        createdAt: row.createdAt,
        revoked: !!row.revoked,
      };
    } catch (error) {
      logger.error(`RefreshTokenRepository: findByToken failed. Falling back to in-memory store. Error: ${(error as Error).message}`);
      this.useFallback = true;
      const record = RefreshTokenRepository.fallbackStore.get(token);
      return record && !record.revoked ? record : null;
    }
  }

  async revoke(token: string): Promise<boolean> {
    const record = RefreshTokenRepository.fallbackStore.get(token);
    if (record) {
      record.revoked = true;
      RefreshTokenRepository.fallbackStore.set(token, record);
    }

    if (this.useFallback) {
      return true;
    }

    try {
      const sql = `UPDATE refresh_tokens SET revoked = 1 WHERE token = ?`;
      await dbPool.query(sql, [token]);
      return true;
    } catch (error) {
      logger.error(`RefreshTokenRepository: revoke failed. Error: ${(error as Error).message}`);
      return false;
    }
  }

  async revokeAllForUser(userId: string): Promise<boolean> {
    for (const [token, record] of RefreshTokenRepository.fallbackStore.entries()) {
      if (record.userId === userId) {
        record.revoked = true;
        RefreshTokenRepository.fallbackStore.set(token, record);
      }
    }

    if (this.useFallback) {
      return true;
    }

    try {
      const sql = `UPDATE refresh_tokens SET revoked = 1 WHERE userId = ?`;
      await dbPool.query(sql, [userId]);
      return true;
    } catch (error) {
      logger.error(`RefreshTokenRepository: revokeAllForUser failed. Error: ${(error as Error).message}`);
      return false;
    }
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
export default refreshTokenRepository;
