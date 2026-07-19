import { Request, Response, NextFunction } from 'express';

export async function createKpiDefinition(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function listKpiDefinitions(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: [] });
}

export async function getEmployeePerformance(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: {} });
}

export async function assignKpiToEmployee(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'KPI assigned' });
}

export async function evaluateAndSaveOverallKpis(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'KPI evaluated' });
}

export async function getEmployeeEvaluationsHistory(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: [] });
}
