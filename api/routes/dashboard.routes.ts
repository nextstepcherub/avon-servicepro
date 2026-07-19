import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, getDashboardAnalytics);

export default router;
