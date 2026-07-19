import { Router } from 'express';
import { registerUser, loginUser, impersonateUser, getMe, logoutUser, refreshSessionToken } from '../controllers/auth.controller';
import { authenticate, requireRole, sessionMiddleware } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/login', loginUser);
router.post('/refresh', refreshSessionToken);
router.post('/logout', logoutUser);

// Protected routes
router.get('/me', sessionMiddleware, getMe);

// Admin-only user management
router.post('/register', authenticate, requireRole(['Admin', 'System Admin']), registerUser);
router.post('/impersonate/:userId', authenticate, requireRole(['Admin', 'System Admin']), impersonateUser);

export default router;
