import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { session, userProfile } = await authService.login(email, password);
  res.status(200).json({
    status: 'success',
    message: 'Login successful. Session tokens issued.',
    data: { 
      token: session.access_token, 
      accessToken: session.access_token, 
      refreshToken: session.refresh_token, 
      user: userProfile 
    },
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
});
