import { Request, Response } from 'express';
import { jobService } from '../services/job.service';
import { jobRepository } from '../repositories/job.repository';
import { asyncHandler } from '../utils/asyncHandler';

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;
  
  const job = await jobService.createJob(req.body, userId, userName, userRole);
  res.status(201).json({
    status: 'success',
    data: { job },
  });
});

export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const job = await jobService.getJobDetails(id);
  res.status(200).json({
    status: 'success',
    data: { job },
  });
});

export const listJobs = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset, sortBy, sortOrder, search, ...filters } = req.query;
  const options = {
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'ASC' | 'DESC',
    search: search as string,
    filters: filters as Record<string, any>,
  };
  
  const result = await jobRepository.findAll(options);
  res.status(200).json({
    status: 'success',
    results: result.data.length,
    total: result.total,
    data: { jobs: result.data },
  });
});

export const updateJobWorkflow = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { remarks, ...updates } = req.body;
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;
  
  const job = await jobService.updateJobWorkflow(id, updates, remarks, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    message: 'Job workflow updated successfully',
    data: { job },
  });
});

export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await jobRepository.delete(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const assignEngineer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { assignedEngineerId, assignedEngineerName, remarks } = req.body;
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;
  
  const job = await jobService.assignJob(
    id,
    assignedEngineerId,
    assignedEngineerName,
    remarks,
    userId,
    userName,
    userRole
  );
  
  res.status(200).json({
    status: 'success',
    message: 'Engineer assigned to job successfully',
    data: { job },
  });
});

export const addJobReport = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reportType, reportData } = req.body;
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;
  
  const job = await jobService.addJobReport(
    id,
    reportType,
    reportData,
    userId,
    userName,
    userRole
  );
  
  res.status(200).json({
    status: 'success',
    message: 'Report logged to job successfully',
    data: { job },
  });
});

export const addJobMeasurements = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { measurements } = req.body;
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;
  
  const job = await jobService.addJobMeasurements(
    id,
    measurements,
    userId,
    userName,
    userRole
  );
  
  res.status(200).json({
    status: 'success',
    message: 'Diagnostic measurements logged successfully',
    data: { job },
  });
});
