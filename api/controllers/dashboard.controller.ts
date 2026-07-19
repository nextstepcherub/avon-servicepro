import { Request, Response, NextFunction } from 'express';

export async function getDashboardAnalytics(req: Request, res: Response, next: NextFunction) {
  res.json({
    status: 'success',
    data: {
      activeTickets: 5,
      pendingInstallations: 2,
      complianceRate: 98,
    }
  });
}
