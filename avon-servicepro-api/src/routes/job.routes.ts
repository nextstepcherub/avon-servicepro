import { Router } from 'express';
import { 
  createJob, 
  getJobById, 
  listJobs, 
  updateJobWorkflow, 
  deleteJob,
  assignEngineer,
  addJobReport,
  addJobMeasurements
} from '../controllers/job.controller';
import { authenticate, requirePermission } from '../middlewares/auth';

const router = Router();

router.use(authenticate); // All job routes require authenticated users

router.route('/')
  .post(requirePermission('jobs:create'), createJob)
  .get(requirePermission('jobs:read'), listJobs);

router.route('/:id')
  .get(requirePermission('jobs:read'), getJobById)
  .patch(requirePermission('jobs:update'), updateJobWorkflow)
  .delete(requirePermission('jobs:delete'), deleteJob);

router.route('/:id/assign')
  .patch(requirePermission('jobs:update'), assignEngineer);

router.route('/:id/report')
  .post(requirePermission('jobs:update'), addJobReport);

router.route('/:id/measurements')
  .post(requirePermission('jobs:update'), addJobMeasurements);

export default router;
