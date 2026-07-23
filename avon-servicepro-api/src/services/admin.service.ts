import { userRepository, UserEntity } from '../repositories/user.repository';
import { rbacRepository, PermissionEntity } from '../repositories/rbac.repository';
import { auditRepository } from '../repositories/audit.repository';
import { logger } from '../config/logger';
import { BadRequestError, NotFoundError } from '../utils/apiError';
import { QueryOptions } from '../repositories/base.repository';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  tags: string[];
  avatarUrl?: string;
  territory?: string;
}

export class AdminService {
  private formatUser(user: UserEntity): UserResponse {
    let parsedTags: string[] = [];
    try {
      parsedTags = JSON.parse(user.tags);
      if (!Array.isArray(parsedTags)) {
        parsedTags = [];
      }
    } catch (e) {
      parsedTags = [];
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tags: parsedTags,
      avatarUrl: user.avatarUrl,
      territory: user.territory,
    };
  }

  // User Administration Operations
  async listUsers(options?: QueryOptions): Promise<{ data: UserResponse[]; total: number }> {
    logger.info(`AdminService: Listing users with options: ${JSON.stringify(options)}`);
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'name';
    const sortOrder = options?.sortOrder ?? 'ASC';
    
    let whereClause = '1=1';
    const params: any[] = [];
    
    if (options?.search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ? OR territory LIKE ?)';
      const searchPattern = `%${options.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    if (options?.filters?.role) {
      whereClause += ' AND role = ?';
      params.push(options.filters.role);
    }
    
    const countSql = `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM users 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;
    
    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;
    
    const data = await dbPool.query(selectSql, [...params, limit, offset]) as UserEntity[];
    return {
      data: data.map(u => this.formatUser(u)),
      total,
    };
  }

  async getUserById(id: string): Promise<UserResponse> {
    logger.info(`AdminService: Fetching user details for ${id}`);
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID '${id}' not found`);
    }
    return this.formatUser(user);
  }

  async createUser(
    userData: {
      name: string;
      email: string;
      role: string;
      tags?: string[];
      avatarUrl?: string;
      territory?: string;
    },
    actorId: string,
    actorName: string,
    actorRole: string
  ): Promise<UserResponse> {
    logger.info(`AdminService: Actor ${actorName} is creating new user ${userData.email}`);

    const existing = await dbPool.query('SELECT * FROM users WHERE email = ?', [userData.email]);
    if (existing.length > 0) {
      throw new BadRequestError(`A user with email '${userData.email}' already exists`);
    }

    const id = uuidv4();
    const tagsArray = userData.tags || [];
    const sql = `
      INSERT INTO users (
        id, name, email, role, tags, avatarUrl, territory
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await dbPool.query(sql, [
      id, userData.name, userData.email, userData.role, JSON.stringify(tagsArray),
      userData.avatarUrl, userData.territory
    ]);

    const newUser = await userRepository.findById(id);

    // Log administrative audit action
    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId: actorId,
      userName: actorName,
      userRole: actorRole,
      action: 'ADMIN_USER_CREATE',
      newValue: newUser!.id,
      remarks: `Admin created user profile for '${newUser!.name}' with role '${newUser!.role}'`,
    });

    return this.formatUser(newUser!);
  }

  async updateUser(
    id: string,
    userData: {
      name?: string;
      email?: string;
      role?: string;
      tags?: string[];
      avatarUrl?: string;
      territory?: string;
    },
    actorId: string,
    actorName: string,
    actorRole: string
  ): Promise<UserResponse> {
    logger.info(`AdminService: Actor ${actorName} is updating user profile ${id}`);

    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError(`User with ID '${id}' not found`);
    }

    if (userData.email && userData.email !== existingUser.email) {
      const emailConflict = await dbPool.query('SELECT * FROM users WHERE email = ?', [userData.email]);
      if (emailConflict.length > 0) {
        throw new BadRequestError(`Email '${userData.email}' is already taken by another profile`);
      }
    }

    const updates: Partial<UserEntity> = {};
    if (userData.name !== undefined) updates.name = userData.name;
    if (userData.email !== undefined) updates.email = userData.email;
    if (userData.role !== undefined) updates.role = userData.role;
    if (userData.avatarUrl !== undefined) updates.avatarUrl = userData.avatarUrl;
    if (userData.territory !== undefined) updates.territory = userData.territory;
    
    if (userData.tags !== undefined) {
      updates.tags = JSON.stringify(userData.tags);
    }

    const updatedUser = await userRepository.updateProfile(id, updates);

    // Audit changes
    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId: actorId,
      userName: actorName,
      userRole: actorRole,
      action: 'ADMIN_USER_UPDATE',
      newValue: id,
      remarks: `Admin updated user profile for '${updatedUser.name}'`,
    });

    return this.formatUser(updatedUser);
  }

  async deleteUser(id: string, actorId: string, actorName: string, actorRole: string): Promise<boolean> {
    logger.info(`AdminService: Actor ${actorName} is deleting user ${id}`);

    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID '${id}' not found`);
    }

    if (user.id === actorId) {
      throw new BadRequestError('Self-deletion is forbidden');
    }

    await dbPool.query('DELETE FROM users WHERE id = ?', [id]);

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId: actorId,
      userName: actorName,
      userRole: actorRole,
      action: 'ADMIN_USER_DELETE',
      remarks: `Admin deleted user profile for '${user.name}' (${user.email})`,
    });

    return true;
  }

  // RBAC Roles & Permissions Management
  async listPermissions(): Promise<PermissionEntity[]> {
    logger.info('AdminService: Listing all permissions');
    return rbacRepository.getAllPermissions();
  }

  async createPermission(code: string, description?: string, actorId?: string, actorName?: string, actorRole?: string): Promise<PermissionEntity> {
    logger.info(`AdminService: Creating permission '${code}'`);
    if (!code) {
      throw new BadRequestError('Permission code is required');
    }

    const formattedCode = code.trim().toLowerCase();
    const existing = await rbacRepository.getAllPermissions();
    if (existing.some(p => p.code === formattedCode)) {
      throw new BadRequestError(`Permission with code '${formattedCode}' already exists`);
    }

    const newPerm = await rbacRepository.createPermission(formattedCode, description);
    if (!newPerm) {
      throw new BadRequestError(`Failed to create permission with code '${formattedCode}'`);
    }

    if (actorId && actorName && actorRole) {
      await auditRepository.create({
        timestamp: new Date().toISOString(),
        userId: actorId,
        userName: actorName,
        userRole: actorRole,
        action: 'ADMIN_PERMISSION_CREATE',
        newValue: newPerm.id,
        remarks: `Created permission '${formattedCode}'`,
      });
    }

    return newPerm;
  }

  async deletePermission(code: string, actorId?: string, actorName?: string, actorRole?: string): Promise<boolean> {
    logger.info(`AdminService: Deleting permission '${code}'`);
    if (!code) {
      throw new BadRequestError('Permission code is required');
    }

    const success = await rbacRepository.deletePermission(code);
    if (!success) {
      throw new NotFoundError(`Permission with code '${code}' not found or could not be deleted`);
    }

    if (actorId && actorName && actorRole) {
      await auditRepository.create({
        timestamp: new Date().toISOString(),
        userId: actorId,
        userName: actorName,
        userRole: actorRole,
        action: 'ADMIN_PERMISSION_DELETE',
        remarks: `Deleted permission '${code}'`,
      });
    }

    return success;
  }

  async listRolesWithPermissions(): Promise<{ roleName: string; permissions: string[] }[]> {
    logger.info('AdminService: Listing all roles and permissions');
    return rbacRepository.getAllRolesWithPermissions();
  }

  async assignPermissionToRole(roleName: string, permissionCode: string, actorId: string, actorName: string, actorRole: string): Promise<boolean> {
    logger.info(`AdminService: Assigning permission '${permissionCode}' to role '${roleName}'`);
    if (!roleName || !permissionCode) {
      throw new BadRequestError('Role name and permission code are required');
    }

    const success = await rbacRepository.assignPermissionToRole(roleName, permissionCode);
    if (!success) {
      throw new BadRequestError(`Failed to assign permission '${permissionCode}' to role '${roleName}'`);
    }

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId: actorId,
      userName: actorName,
      userRole: actorRole,
      action: 'ADMIN_ROLE_PERM_ASSIGN',
      remarks: `Assigned permission '${permissionCode}' to role '${roleName}'`,
    });

    return true;
  }

  async revokePermissionFromRole(roleName: string, permissionCode: string, actorId: string, actorName: string, actorRole: string): Promise<boolean> {
    logger.info(`AdminService: Revoking permission '${permissionCode}' from role '${roleName}'`);
    if (!roleName || !permissionCode) {
      throw new BadRequestError('Role name and permission code are required');
    }

    const success = await rbacRepository.revokePermissionFromRole(roleName, permissionCode);
    if (!success) {
      throw new BadRequestError(`Failed to revoke permission '${permissionCode}' from role '${roleName}'`);
    }

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId: actorId,
      userName: actorName,
      userRole: actorRole,
      action: 'ADMIN_ROLE_PERM_REVOKE',
      remarks: `Revoked permission '${permissionCode}' from role '${roleName}'`,
    });

    return true;
  }
}

export const adminService = new AdminService();
export default adminService;
