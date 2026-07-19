import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { dashboardService } from '../services/dashboard.service';

export const getDashboardAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const referenceDate = req.query.date as string | undefined;
  
  const stats = await dashboardService.getDashboardStats(referenceDate);
  
  res.status(200).json({
    status: 'success',
    data: stats
  });
});
