import { Router } from 'express';
import { registerUser, loginUser, impersonateUser, getMe, logoutUser, refreshSessionToken } from '../controllers/auth.controller';
import { authenticate, requireRole, sessionMiddleware } from '../middleware/auth';
import { authenticateSupabase } from '../middleware/supabaseAuth';

const router = Router();

// Public routes
router.post('/login', loginUser);
router.post('/refresh', refreshSessionToken);
router.post('/logout', logoutUser);

// Protected routes
router.get('/me', sessionMiddleware, getMe);

// Supabase authenticated route
router.get('/supabase-verify', authenticateSupabase, (req, res) => {
  res.json({
    status: 'success',
    authMode: (req as any).supabaseContext?.authMode,
    userClaims: (req as any).supabaseContext?.userClaims,
  });
});


// Admin-only user management
router.post('/register', authenticate, requireRole(['Admin', 'System Admin']), registerUser);
router.post('/impersonate/:userId', authenticate, requireRole(['Admin', 'System Admin']), impersonateUser);

export default router;
