import { Router } from 'express';
import { loginUser, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/login', loginUser);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
