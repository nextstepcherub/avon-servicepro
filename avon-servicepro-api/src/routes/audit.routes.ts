import { Router } from 'express';
import { listAuditLogs } from '../controllers/audit.controller';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

// Only admin / system admins are allowed to read audit trails
router.get('/', authenticate, requireRole(['Admin', 'System Admin']), listAuditLogs);

export default router;
