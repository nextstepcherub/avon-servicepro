import { Request, Response } from 'express';
import { reportService } from '../services/report.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getOperationalReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.getOperationalReport();
  res.status(200).json({
    status: 'success',
    data: report
  });
});

export const getKpiReport = asyncHandler(async (req: Request, res: Response) => {
  const { financialYearId } = req.query;
  const report = await reportService.getKpiReport((financialYearId as string) || 'FY26-27');
  res.status(200).json({
    status: 'success',
    data: report
  });
});

export const getExecutiveReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.getExecutiveReport();
  res.status(200).json({
    status: 'success',
    data: report
  });
});
