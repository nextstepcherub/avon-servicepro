import { Router } from 'express';
import { 
  createKpiDefinition, 
  listKpiDefinitions, 
  getEmployeePerformance, 
  assignKpiToEmployee,
  evaluateAndSaveOverallKpis,
  getEmployeeEvaluationsHistory
} from '../controllers/kpi.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate); // Require authentication

router.route('/definitions')
  .post(authorize(['Admin', 'System Admin', 'Service Manager']), createKpiDefinition)
  .get(listKpiDefinitions);

router.get('/performance/:employeeId', getEmployeePerformance);
router.post('/performance/:employeeId/evaluate', authorize(['Admin', 'System Admin', 'Service Manager']), evaluateAndSaveOverallKpis);
router.get('/performance/:employeeId/history', getEmployeeEvaluationsHistory);

router.post('/assignments', authorize(['Admin', 'System Admin', 'Service Manager']), assignKpiToEmployee);

export default router;
