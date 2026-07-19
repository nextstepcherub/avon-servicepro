import { Router } from 'express';
import {
  getOperationalReport,
  getKpiReport,
  getExecutiveReport
} from '../controllers/report.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Protect all routes
router.use(authenticate);

router.get('/operational', getOperationalReport);
router.get('/kpi', getKpiReport);
router.get('/executive', getExecutiveReport);

export default router;
