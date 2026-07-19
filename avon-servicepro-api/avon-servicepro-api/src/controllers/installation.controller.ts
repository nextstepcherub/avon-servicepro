import { Request, Response } from 'express';
import { installationService } from '../services/installation.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getInstallationSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await installationService.getSummary();
  res.status(200).json({
    status: 'success',
    data: summary
  });
});

export const createInstallationRequest = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;

  const request = await installationService.createRequest(req.body, userId, userName, userRole);
  res.status(201).json({
    status: 'success',
    message: 'Installation request created successfully.',
    data: { request }
  });
});

export const listInstallationRequests = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset, sortBy, sortOrder, search, ...filters } = req.query;
  const options = {
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'ASC' | 'DESC',
    search: search as string,
    filters: filters as Record<string, any>
  };

  const result = await installationService.listRequests(options);
  res.status(200).json({
    status: 'success',
    results: result.data.length,
    total: result.total,
    data: { requests: result.data }
  });
});

export const getInstallationRequestById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const request = await installationService.getRequestDetails(id);
  res.status(200).json({
    status: 'success',
    data: { request }
  });
});

export const updateInstallationRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;

  const request = await installationService.updateRequest(id, req.body, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    message: 'Installation request updated successfully.',
    data: { request }
  });
});

export const deleteInstallationRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;

  await installationService.deleteRequest(id, userId, userName, userRole);
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const assignInstallationRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // request id
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;

  const assignment = await installationService.assignInstallation(id, req.body, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    message: 'Lead engineer and staff successfully assigned to installation.',
    data: { assignment }
  });
});

export const advanceInstallationStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // request id
  const { status, notes } = req.body;
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;

  const request = await installationService.advanceStatus(id, status, notes, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    message: `Installation workflow successfully progressed to: ${status}`,
    data: { request }
  });
});

export const updateInstallationTracker = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // installation tracking id
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;

  const installation = await installationService.updateInstallation(id, req.body, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    message: 'Installation completion record successfully updated.',
    data: { installation }
  });
});
