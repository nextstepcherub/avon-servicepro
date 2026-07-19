import { Router } from 'express';
import {
  createAmcContract,
  getAmcContract,
  listAmcContracts,
  updateAmcContract,
  renewAmcContract,
  deleteAmcContract,
  getAmcSlaStats
} from '../controllers/amc.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Protect all routes
router.use(authenticate);

// SLA stats / telemetry
router.get('/sla/telemetry', getAmcSlaStats);

// Contract CRUD Endpoints
router.route('/')
  .post(authorize(['Admin', 'System Admin', 'Service Manager']), createAmcContract)
  .get(listAmcContracts);

router.route('/:id')
  .get(getAmcContract)
  .put(authorize(['Admin', 'System Admin', 'Service Manager']), updateAmcContract)
  .delete(authorize(['Admin', 'System Admin', 'Service Manager']), deleteAmcContract);

// Renewal / Escalation trigger
router.post('/:id/renew', authorize(['Admin', 'System Admin', 'Service Manager']), renewAmcContract);

export default router;
