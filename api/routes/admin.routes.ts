import { Router } from 'express';
import {
  getUsersList,
  getUserDetail,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getPermissionsList,
  createPermission,
  deletePermission,
  getRolesList,
  assignPermissionToRole,
  revokePermissionFromRole,
} from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  createUserSchema,
  updateUserSchema,
  createPermissionSchema,
  rolePermissionSchema,
} from '../validators/admin.validator';

const router = Router();

// Protect all administrative routes
router.use(authenticate, requireRole(['Admin', 'System Admin']));

// Users Admin Routes
router.route('/users')
  .get(getUsersList)
  .post(validateRequest(createUserSchema), createAdminUser);

router.route('/users/:id')
  .get(getUserDetail)
  .patch(validateRequest(updateUserSchema), updateAdminUser)
  .delete(deleteAdminUser);

// Permissions Admin Routes
router.route('/permissions')
  .get(getPermissionsList)
  .post(validateRequest(createPermissionSchema), createPermission);

router.route('/permissions/:code')
  .delete(deletePermission);

// Roles Admin Routes
router.route('/roles')
  .get(getRolesList);

router.post('/roles/assign', validateRequest(rolePermissionSchema), assignPermissionToRole);
router.post('/roles/revoke', validateRequest(rolePermissionSchema), revokePermissionFromRole);

export default router;
