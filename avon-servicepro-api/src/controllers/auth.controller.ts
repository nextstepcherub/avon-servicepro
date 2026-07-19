import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, role, password, tags, territory, avatarUrl } = req.body;
  const user = await authService.register(name, email, role, password, tags || [], territory, avatarUrl);
  res.status(201).json({
    status: 'success',
    message: 'User profile registered successfully',
    data: { user },
  });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, token, user } = await authService.login(email, password);
  res.status(200).json({
    status: 'success',
    message: 'Login successful. Session tokens issued.',
    data: { token, accessToken, refreshToken, user },
  });
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const token = req.body.refreshToken || req.headers['x-refresh-token'] || req.body.token;
  const userId = req.user?.id;

  await authService.logout(token, userId);

  res.status(200).json({
    status: 'success',
    message: 'User logged out and session terminated successfully.',
  });
});

export const refreshSessionToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.body.refreshToken || req.headers['x-refresh-token'];
  
  const tokens = await authService.refresh(token);

  res.status(200).json({
    status: 'success',
    message: 'Session tokens successfully refreshed.',
    data: tokens,
  });
});

export const impersonateUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const requestingAdminId = req.user?.id as string;
  const { token, user } = await authService.impersonate(userId, requestingAdminId);
  res.status(200).json({
    status: 'success',
    message: 'User impersonated successfully.',
    data: { token, user },
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
});
