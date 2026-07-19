import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getUsersList = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset, sortBy, sortOrder, search, role } = req.query;
  const options = {
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'ASC' | 'DESC',
    search: search as string,
    filters: role ? { role: role as string } : undefined,
  };

  const { data, total } = await adminService.listUsers(options);
  res.status(200).json({
    status: 'success',
    results: data.length,
    total,
    data: { users: data },
  });
});

export const getUserDetail = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await adminService.getUserById(id);
  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

export const createAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const actorId = req.user?.id || 'SYSTEM';
  const actorName = req.user?.name || 'Admin Panel';
  const actorRole = req.user?.role || 'Admin';

  const user = await adminService.createUser(req.body, actorId, actorName, actorRole);
  res.status(201).json({
    status: 'success',
    message: 'User profile created successfully.',
    data: { user },
  });
});

export const updateAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const actorId = req.user?.id || 'SYSTEM';
  const actorName = req.user?.name || 'Admin Panel';
  const actorRole = req.user?.role || 'Admin';

  const user = await adminService.updateUser(id, req.body, actorId, actorName, actorRole);
  res.status(200).json({
    status: 'success',
    message: 'User profile updated successfully.',
    data: { user },
  });
});

export const deleteAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const actorId = req.user?.id || 'SYSTEM';
  const actorName = req.user?.name || 'Admin Panel';
  const actorRole = req.user?.role || 'Admin';

  await adminService.deleteUser(id, actorId, actorName, actorRole);
  res.status(200).json({
    status: 'success',
    message: 'User profile deleted successfully.',
  });
});

export const getPermissionsList = asyncHandler(async (req: Request, res: Response) => {
  const permissions = await adminService.listPermissions();
  res.status(200).json({
    status: 'success',
    results: permissions.length,
    data: { permissions },
  });
});

export const createPermission = asyncHandler(async (req: Request, res: Response) => {
  const { code, description } = req.body;
  const actorId = req.user?.id || 'SYSTEM';
  const actorName = req.user?.name || 'Admin Panel';
  const actorRole = req.user?.role || 'Admin';

  const permission = await adminService.createPermission(code, description, actorId, actorName, actorRole);
  res.status(201).json({
    status: 'success',
    message: 'Permission created successfully.',
    data: { permission },
  });
});

export const deletePermission = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params;
  const actorId = req.user?.id || 'SYSTEM';
  const actorName = req.user?.name || 'Admin Panel';
  const actorRole = req.user?.role || 'Admin';

  await adminService.deletePermission(code, actorId, actorName, actorRole);
  res.status(200).json({
    status: 'success',
    message: `Permission '${code}' deleted successfully.`,
  });
});

export const getRolesList = asyncHandler(async (req: Request, res: Response) => {
  const roles = await adminService.listRolesWithPermissions();
  res.status(200).json({
    status: 'success',
    results: roles.length,
    data: { roles },
  });
});

export const assignPermissionToRole = asyncHandler(async (req: Request, res: Response) => {
  const { roleName, permissionCode } = req.body;
  const actorId = req.user?.id || 'SYSTEM';
  const actorName = req.user?.name || 'Admin Panel';
  const actorRole = req.user?.role || 'Admin';

  await adminService.assignPermissionToRole(roleName, permissionCode, actorId, actorName, actorRole);
  res.status(200).json({
    status: 'success',
    message: `Permission '${permissionCode}' assigned to role '${roleName}' successfully.`,
  });
});

export const revokePermissionFromRole = asyncHandler(async (req: Request, res: Response) => {
  const { roleName, permissionCode } = req.body;
  const actorId = req.user?.id || 'SYSTEM';
  const actorName = req.user?.name || 'Admin Panel';
  const actorRole = req.user?.role || 'Admin';

  await adminService.revokePermissionFromRole(roleName, permissionCode, actorId, actorName, actorRole);
  res.status(200).json({
    status: 'success',
    message: `Permission '${permissionCode}' revoked from role '${roleName}' successfully.`,
  });
});
