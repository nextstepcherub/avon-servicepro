import { Router } from 'express';
import {
  getInstallationSummary,
  createInstallationRequest,
  listInstallationRequests,
  getInstallationRequestById,
  updateInstallationRequest,
  deleteInstallationRequest,
  assignInstallationRequest,
  advanceInstallationStatus,
  updateInstallationTracker
} from '../controllers/installation.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate); // All routes in this module require active session tokens

router.route('/summary')
  .get(getInstallationSummary);

router.route('/requests')
  .post(createInstallationRequest)
  .get(listInstallationRequests);

router.route('/requests/:id')
  .get(getInstallationRequestById)
  .put(updateInstallationRequest)
  .delete(deleteInstallationRequest);

router.route('/requests/:id/assign')
  .post(assignInstallationRequest);

router.route('/requests/:id/advance')
  .post(advanceInstallationStatus);

router.route('/trackers/:id')
  .put(updateInstallationTracker);

export default router;
