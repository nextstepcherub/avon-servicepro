import { Router } from 'express';
import { createCustomer, getCustomerById, listCustomers, updateCustomer, deleteCustomer } from '../controllers/customer.controller';
import { authenticate, requirePermission } from '../middleware/auth';

const router = Router();

router.use(authenticate); // Require authentication for customers

router.route('/')
  .post(requirePermission('customers:create'), createCustomer)
  .get(requirePermission('customers:read'), listCustomers);

router.route('/:id')
  .get(requirePermission('customers:read'), getCustomerById)
  .patch(requirePermission('customers:update'), updateCustomer)
  .delete(requirePermission('customers:delete'), deleteCustomer);

export default router;
