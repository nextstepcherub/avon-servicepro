import { userRepository, UserEntity } from '../repositories/user.repository';
import { rbacRepository, PermissionEntity } from '../repositories/rbac.repository';
import { auditRepository } from '../repositories/audit.repository';
import { logger } from '../config/logger';
import { BadRequestError, NotFoundError } from '../utils/apiError';
import { QueryOptions } from '../repositories/base.repository';
import bcrypt from 'bcryptjs';

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
    const { data, total } = await userRepository.findAll(options);
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
      passwordPlain: string;
      tags?: string[];
      avatarUrl?: string;
      territory?: string;
    },
    actorId: string,
    actorName: string,
    actorRole: string
  ): Promise<UserResponse> {
    logger.info(`AdminService: Actor ${actorName} is creating new user ${userData.email}`);

    const existing = await userRepository.findByEmail(userData.email);
    if (existing) {
      throw new BadRequestError(`A user with email '${userData.email}' already exists`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.passwordPlain, salt);

    const tagsArray = userData.tags || [];
    const newUser = await userRepository.create({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      tags: JSON.stringify(tagsArray),
      avatarUrl: userData.avatarUrl,
      territory: userData.territory,
      passwordHash: hashedPassword,
    });

    // Log administrative audit action
    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId: actorId,
      userName: actorName,
      userRole: actorRole,
      action: 'ADMIN_USER_CREATE',
      newValue: newUser.id,
      remarks: `Admin created user profile for '${newUser.name}' with role '${newUser.role}'`,
    });

    return this.formatUser(newUser);
  }

  async updateUser(
    id: string,
    userData: {
      name?: string;
      email?: string;
      role?: string;
      passwordPlain?: string;
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
      const emailConflict = await userRepository.findByEmail(userData.email);
      if (emailConflict) {
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

    if (userData.passwordPlain !== undefined && userData.passwordPlain !== '') {
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(userData.passwordPlain, salt);
    }

    const updatedUser = await userRepository.update(id, updates);

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

    const success = await userRepository.delete(id);

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId: actorId,
      userName: actorName,
      userRole: actorRole,
      action: 'ADMIN_USER_DELETE',
      remarks: `Admin deleted user profile for '${user.name}' (${user.email})`,
    });

    return success;
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
