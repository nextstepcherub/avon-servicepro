import { dbPool } from '../config/database';
import { uuidHelper } from '../utils/uuid';
import { QueryBuilder } from './query.builder';
import { paginationHelper } from '../utils/pagination';

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  filters?: Record<string, any>;
}

export interface BaseRepository<T> {
  create(entity: Omit<T, 'id'> | T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(options?: QueryOptions): Promise<{ data: T[]; total: number }>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

export abstract class AbstractRepository<T> implements BaseRepository<T> {
  abstract create(entity: Omit<T, 'id'> | T): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(options?: QueryOptions): Promise<{ data: T[]; total: number }>;
  abstract update(id: string, entity: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<boolean>;
}

/**
 * Generic CRUD Repository implementing automated queries, JSON parsing,
 * pagination integration, and UUID assertions for any table.
 */
export class GenericCrudRepository<T extends { id: string }> extends AbstractRepository<T> {
  constructor(
    protected readonly tableName: string,
    protected readonly allColumns: string[],
    protected readonly jsonFields: string[] = []
  ) {
    super();
  }

  /**
   * Helper to deserialize specific text/varchar columns containing JSON into parsed structures.
   */
  protected deserialize(row: any): T {
    if (!row) return row;
    const result = { ...row };
    for (const field of this.jsonFields) {
      if (typeof result[field] === 'string') {
        try {
          result[field] = JSON.parse(result[field]);
        } catch {
          // Fallback to original string if not valid JSON
        }
      }
    }
    return result as T;
  }

  /**
   * Helper to serialize fields (like objects or arrays) into standard stringified JSON strings for safe database insert/updates.
   */
  protected serialize(entity: any): any {
    const result = { ...entity };
    for (const field of this.jsonFields) {
      if (result[field] !== undefined && typeof result[field] !== 'string') {
        result[field] = JSON.stringify(result[field]);
      }
    }
    return result;
  }

  async create(entity: Omit<T, 'id'> | T): Promise<T> {
    const id = ('id' in entity && entity.id) ? (entity.id as string) : uuidHelper.generate();
    const fullEntity = { ...entity, id } as T;
    const serialized = this.serialize(fullEntity);

    const keys = Object.keys(serialized).filter(key => this.allColumns.includes(key));
    const setClause = keys.join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const params = keys.map(key => serialized[key]);

    const sql = `INSERT INTO ${this.tableName} (${setClause}) VALUES (${placeholders})`;
    await dbPool.query(sql, params);

    return fullEntity;
  }

  async findById(id: string): Promise<T | null> {
    uuidHelper.assertValid(id);
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    if (rows.length === 0) return null;
    return this.deserialize(rows[0]);
  }

  async findAll(options?: QueryOptions): Promise<{ data: T[]; total: number }> {
    const { limit, offset, sortBy, sortOrder } = paginationHelper.getPaginationOptions(options);
    
    const builder = QueryBuilder.table(this.tableName)
      .select('*')
      .orderBy(sortBy, sortOrder)
      .limit(limit)
      .offset(offset);

    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value !== undefined && this.allColumns.includes(key)) {
          builder.whereEquals(key, value);
        }
      }
    }

    const query = builder.build();
    const countQuery = builder.buildCount();

    const totalResult = await dbPool.query(countQuery.sql, countQuery.params);
    const rawTotal = totalResult[0]?.total ?? 0;
    const total = typeof rawTotal === 'string' ? parseInt(rawTotal, 10) : Number(rawTotal);

    const rows = await dbPool.query(query.sql, query.params);
    const data = rows.map((row: any) => this.deserialize(row));

    return { data, total };
  }

  async update(id: string, entity: Partial<T>): Promise<T> {
    uuidHelper.assertValid(id);
    const serialized = this.serialize(entity);
    const keys = Object.keys(serialized).filter(key => key !== 'id' && this.allColumns.includes(key));
    
    if (keys.length > 0) {
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const params = keys.map(key => serialized[key]);
      const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
      await dbPool.query(sql, [...params, id]);
    }

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Record with id ${id} not found in ${this.tableName} to perform updates.`);
    }
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    uuidHelper.assertValid(id);
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }
}
