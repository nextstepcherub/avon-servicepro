import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface OrgUnitEntity {
  id: string;
  name: string;
  code: string;
  type: 'COMPANY' | 'BRANCH' | 'DEPARTMENT' | 'UNIT';
  parentId?: string;
  managerId?: string;
}

export class OrgRepository extends AbstractRepository<OrgUnitEntity> {
  async create(entity: Omit<OrgUnitEntity, 'id'>): Promise<OrgUnitEntity> {
    const id = uuidv4();
    const newOrgUnit: OrgUnitEntity = { ...entity, id };
    
    logger.info(`Repository: Saving organizational unit ${id} (${newOrgUnit.name})`);
    const sql = `
      INSERT INTO organizational_units (
        id, name, code, type, parentId, managerId
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    await dbPool.query(sql, [
      newOrgUnit.id, newOrgUnit.name, newOrgUnit.code, newOrgUnit.type,
      newOrgUnit.parentId, newOrgUnit.managerId
    ]);
    
    return newOrgUnit;
  }

  async findById(id: string): Promise<OrgUnitEntity | null> {
    const sql = `SELECT * FROM organizational_units WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? rows[0] as OrgUnitEntity : null;
  }

  async findByCode(code: string): Promise<OrgUnitEntity | null> {
    const sql = `SELECT * FROM organizational_units WHERE code = ?`;
    const rows = await dbPool.query(sql, [code]);
    return rows.length > 0 ? rows[0] as OrgUnitEntity : null;
  }

  async hasChildren(id: string): Promise<boolean> {
    const sql = `SELECT COUNT(*) as count FROM organizational_units WHERE parentId = ?`;
    const result = await dbPool.query(sql, [id]);
    return (result[0]?.count ?? 0) > 0;
  }

  async findAll(options?: QueryOptions): Promise<{ data: OrgUnitEntity[]; total: number }> {
    const limit = options?.limit ?? 100;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'name';
    const sortOrder = options?.sortOrder ?? 'ASC';
    
    let whereClause = '1=1';
    const params: any[] = [];
    
    if (options?.filters?.type) {
      whereClause += ' AND type = ?';
      params.push(options.filters.type);
    }
    
    if (options?.filters?.parentId) {
      whereClause += ' AND parentId = ?';
      params.push(options.filters.parentId);
    }
    
    const countSql = `SELECT COUNT(*) as total FROM organizational_units WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM organizational_units 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;
    
    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;
    
    const data = await dbPool.query(selectSql, [...params, limit, offset]) as OrgUnitEntity[];
    return { data, total };
  }

  async update(id: string, entity: Partial<OrgUnitEntity>): Promise<OrgUnitEntity> {
    const keys = Object.keys(entity).filter(key => key !== 'id');
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const params = keys.map(key => (entity as any)[key]);
    
    if (keys.length > 0) {
      const sql = `UPDATE organizational_units SET ${setClause} WHERE id = ?`;
      await dbPool.query(sql, [...params, id]);
    }
    
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM organizational_units WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }

  // RBAC Permission check
  async checkPermission(role: string, permissionCode: string): Promise<boolean> {
    logger.debug(`RBAC Check: Checking permission '${permissionCode}' for role '${role}'`);
    const sql = `
      SELECT COUNT(*) as count 
      FROM rbac_role_permissions rrp
      JOIN rbac_permissions rp ON rrp.permissionId = rp.id
      WHERE rrp.roleName = ? AND rp.code = ?
    `;
    const result = await dbPool.query(sql, [role, permissionCode]);
    return (result[0]?.count ?? 0) > 0;
  }
}

export const orgRepository = new OrgRepository();
