import { Request, Response } from 'express';
import { kpiService } from '../services/kpi.service';
import { kpiRepository } from '../repositories/kpi.repository';
import { asyncHandler } from '../utils/asyncHandler';
import { BadRequestError } from '../utils/apiError';

export const createKpiDefinition = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;
  
  const kpi = await kpiService.createKpi(req.body, userId, userName, userRole);
  res.status(201).json({
    status: 'success',
    data: { kpi },
  });
});

export const listKpiDefinitions = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset, sortBy, sortOrder, roleType } = req.query;
  const options = {
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'ASC' | 'DESC',
    filters: roleType ? { roleType } : undefined,
  };
  
  const result = await kpiRepository.findAll(options);
  res.status(200).json({
    status: 'success',
    results: result.data.length,
    total: result.total,
    data: { kpis: result.data },
  });
});

export const getEmployeePerformance = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId } = req.params;
  const { financialYearId } = req.query;
  
  if (!financialYearId) {
    throw new BadRequestError('financialYearId parameter is required');
  }
  
  const assignments = await kpiService.evaluateEmployeeKpis(employeeId, financialYearId as string);
  res.status(200).json({
    status: 'success',
    data: { performance: assignments },
  });
});

export const evaluateAndSaveOverallKpis = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId } = req.params;
  const { financialYearId, comments } = req.body;
  const evaluatedBy = req.user?.name || req.user?.id || 'System Evaluator';

  if (!financialYearId) {
    throw new BadRequestError('financialYearId in body is required');
  }


  const result = await kpiService.createOverallEvaluation(
    employeeId,
    financialYearId,
    evaluatedBy,
    comments
  );

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

export const getEmployeeEvaluationsHistory = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId } = req.params;
  const evaluations = await kpiService.getEmployeeEvaluations(employeeId);
  
  res.status(200).json({
    status: 'success',
    data: { evaluations },
  });
});

export const assignKpiToEmployee = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await kpiRepository.assignKpiToEmployee(req.body);
  res.status(201).json({
    status: 'success',
    data: { assignment },
  });
});
