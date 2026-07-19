import { Router } from 'express';
import {
  createOrgUnit,
  getOrgUnitById,
  listOrgUnits,
  updateOrgUnit,
  deleteOrgUnit,
  getOrgTree,
} from '../controllers/org.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createOrgUnitSchema, updateOrgUnitSchema } from '../validators/org.validator';

const router = Router();

router.use(authenticate); // Require authentication for all org unit routes

// Hierarchy Tree Route (Must be declared before parameter routes)
router.get('/tree', getOrgTree);

router.route('/')
  .post(requireRole(['Admin', 'System Admin']), validateRequest(createOrgUnitSchema), createOrgUnit)
  .get(listOrgUnits);

router.route('/:id')
  .get(getOrgUnitById)
  .patch(requireRole(['Admin', 'System Admin']), validateRequest(updateOrgUnitSchema), updateOrgUnit)
  .delete(requireRole(['Admin', 'System Admin']), deleteOrgUnit);

export default router;
