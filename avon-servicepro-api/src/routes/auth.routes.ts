import { Router } from 'express';
import { loginUser, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { loginSchema } from '../validators/auth.validator';
import { authRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Public routes with rate limiting and request validation
router.post('/login', authRateLimiter, validateRequest(loginSchema), loginUser);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
