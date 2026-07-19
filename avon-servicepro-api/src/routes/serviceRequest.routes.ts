import { Router } from 'express';
import {
  createServiceRequest,
  listServiceRequests,
  getServiceRequestDetails,
  updateServiceRequest,
  deleteServiceRequest,
  assignServiceRequest,
  updateServiceRequestStatus,
  updateServiceRequestBilling
} from '../controllers/serviceRequest.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate); // All routes in this module require active session tokens

router.route('/')
  .post(createServiceRequest)
  .get(listServiceRequests);

router.route('/:id')
  .get(getServiceRequestDetails)
  .put(updateServiceRequest)
  .delete(deleteServiceRequest);

router.route('/:id/assign')
  .post(assignServiceRequest);

router.route('/:id/status')
  .post(updateServiceRequestStatus);

router.route('/:id/billing')
  .post(updateServiceRequestBilling);

export default router;
