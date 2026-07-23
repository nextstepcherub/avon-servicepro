import { dbPool } from '../config/database';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';

export interface PermissionEntity {
  id: string;
  code: string;
  description?: string;
}

interface CacheEntry {
  permissions: Set<string>;
  cachedAt: number;
}

export class RbacRepository {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  // Clear/invalidate the entire permission cache
  clearCache(): void {
    logger.info('RBAC Cache: Invalidate all entries');
    this.cache.clear();
  }

  // Clear cache for a specific role
  invalidateRole(roleName: string): void {
    logger.info(`RBAC Cache: Invalidate entry for role: ${roleName}`);
    this.cache.delete(roleName);
  }

  /**
   * Fetches all permissions codes for a given role, utilizing the cache.
   */
  async getPermissionsForRole(roleName: string): Promise<Set<string>> {
    const now = Date.now();
    const cached = this.cache.get(roleName);

    if (cached && (now - cached.cachedAt < this.CACHE_TTL_MS)) {
      logger.debug(`RBAC Cache HIT: Found permissions for role '${roleName}'`);
      return cached.permissions;
    }

    logger.debug(`RBAC Cache MISS: Fetching permissions for role '${roleName}' from database`);
    try {
      const sql = `
        SELECT rp.code 
        FROM rbac_role_permissions rrp
        JOIN rbac_permissions rp ON rrp.permissionId = rp.id
        WHERE rrp.roleName = ?
      `;
      const rows = await dbPool.query(sql, [roleName]);
      const permissions = new Set<string>(rows.map((row: any) => row.code));

      this.cache.set(roleName, {
        permissions,
        cachedAt: now
      });

      return permissions;
    } catch (error) {
      logger.error(`RBAC: Failed to fetch permissions for role '${roleName}'. Error: ${(error as Error).message}`);
      // Fallback: If cache exists even if expired, return it under failure. Otherwise return empty set.
      if (cached) {
        logger.warn(`RBAC Fallback: Using expired cache for role '${roleName}' due to DB error.`);
        return cached.permissions;
      }
      return new Set<string>();
    }
  }

  /**
   * Check if a given role has a specific permission.
   */
  async checkPermission(roleName: string, permissionCode: string): Promise<boolean> {
    // System Admins always bypass checks and have all permissions
    if (roleName === 'System Admin') {
      return true;
    }

    const permissions = await this.getPermissionsForRole(roleName);
    return permissions.has(permissionCode);
  }

  /**
   * Assign a permission to a role. Invalidates cache for that role.
   */
  async assignPermissionToRole(roleName: string, permissionCode: string): Promise<boolean> {
    try {
      // Find permission ID
      const findPermSql = `SELECT id FROM rbac_permissions WHERE code = ?`;
      const rows = await dbPool.query(findPermSql, [permissionCode]);
      if (rows.length === 0) {
        logger.error(`RBAC: Permission code '${permissionCode}' not found`);
        return false;
      }
      const permissionId = rows[0].id;

      const insertSql = `
        INSERT INTO rbac_role_permissions (roleName, permissionId) 
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE roleName = roleName
      `;
      await dbPool.query(insertSql, [roleName, permissionId]);
      this.invalidateRole(roleName);
      return true;
    } catch (error) {
      logger.error(`RBAC: Failed to assign permission '${permissionCode}' to role '${roleName}'. Error: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Revoke a permission from a role. Invalidates cache for that role.
   */
  async revokePermissionFromRole(roleName: string, permissionCode: string): Promise<boolean> {
    try {
      const findPermSql = `SELECT id FROM rbac_permissions WHERE code = ?`;
      const rows = await dbPool.query(findPermSql, [permissionCode]);
      if (rows.length === 0) {
        return false;
      }
      const permissionId = rows[0].id;

      const deleteSql = `
        DELETE FROM rbac_role_permissions 
        WHERE roleName = ? AND permissionId = ?
      `;
      await dbPool.query(deleteSql, [roleName, permissionId]);
      this.invalidateRole(roleName);
      return true;
    } catch (error) {
      logger.error(`RBAC: Failed to revoke permission '${permissionCode}' from role '${roleName}'. Error: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Get all defined permissions in the system.
   */
  async getAllPermissions(): Promise<PermissionEntity[]> {
    try {
      const sql = `SELECT * FROM rbac_permissions ORDER BY code ASC`;
      const rows = await dbPool.query(sql);
      return rows as PermissionEntity[];
    } catch (error) {
      logger.error(`RBAC: Failed to fetch all permissions. Error: ${(error as Error).message}`);
      return [];
    }
  }

  /**
   * Get all unique roles with their associated permissions.
   */
  async getAllRolesWithPermissions(): Promise<{ roleName: string; permissions: string[] }[]> {
    try {
      const sql = `
        SELECT rrp.roleName, rp.code as permissionCode
        FROM rbac_role_permissions rrp
        JOIN rbac_permissions rp ON rrp.permissionId = rp.id
        ORDER BY rrp.roleName ASC, rp.code ASC
      `;
      const rows = await dbPool.query(sql);
      
      const rolesMap = new Map<string, string[]>();
      
      for (const row of rows) {
        const { roleName, permissionCode } = row;
        if (!rolesMap.has(roleName)) {
          rolesMap.set(roleName, []);
        }
        rolesMap.get(roleName)!.push(permissionCode);
      }
      
      // Also fetch distinct roles from users to ensure any active roles are listed
      try {
        const userRolesSql = `SELECT DISTINCT role FROM users WHERE role IS NOT NULL AND role != ''`;
        const userRolesRows = await dbPool.query(userRolesSql);
        for (const uRow of userRolesRows) {
          const rName = uRow.role;
          if (!rolesMap.has(rName)) {
            rolesMap.set(rName, []);
          }
        }
      } catch (e) {
        logger.warn(`RBAC: Could not query distinct roles from users. Error: ${(e as Error).message}`);
      }

      return Array.from(rolesMap.entries()).map(([roleName, permissions]) => ({
        roleName,
        permissions
      }));
    } catch (error) {
      logger.error(`RBAC: Failed to fetch roles with permissions. Error: ${(error as Error).message}`);
      return [];
    }
  }

  /**
   * Create a new permission.
   */
  async createPermission(code: string, description?: string): Promise<PermissionEntity | null> {
    try {
      const id = uuidv4();
      const sql = `INSERT INTO rbac_permissions (id, code, description) VALUES (?, ?, ?)`;
      await dbPool.query(sql, [id, code, description || null]);
      return { id, code, description };
    } catch (error) {
      logger.error(`RBAC: Failed to create permission '${code}'. Error: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Delete a permission.
   */
  async deletePermission(code: string): Promise<boolean> {
    try {
      const findSql = `SELECT id FROM rbac_permissions WHERE code = ?`;
      const rows = await dbPool.query(findSql, [code]);
      if (rows.length === 0) return false;
      
      const id = rows[0].id;
      // Delete role mappings
      await dbPool.query(`DELETE FROM rbac_role_permissions WHERE permissionId = ?`, [id]);
      // Delete permission
      await dbPool.query(`DELETE FROM rbac_permissions WHERE id = ?`, [id]);
      
      this.clearCache();
      return true;
    } catch (error) {
      logger.error(`RBAC: Failed to delete permission '${code}'. Error: ${(error as Error).message}`);
      return false;
    }
  }
}

export const rbacRepository = new RbacRepository();
export default rbacRepository;
