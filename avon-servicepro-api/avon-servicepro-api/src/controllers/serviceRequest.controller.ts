import { Request, Response } from 'express';
import { serviceRequestService } from '../services/serviceRequest.service';
import { asyncHandler } from '../utils/asyncHandler';

export const createServiceRequest = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;

  const request = await serviceRequestService.createRequest(req.body, userId, userName, userRole);
  res.status(201).json({
    status: 'success',
    message: 'Service request created and logged successfully.',
    data: { request }
  });
});

export const listServiceRequests = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset, sortBy, sortOrder, search, ...filters } = req.query;
  const options = {
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'ASC' | 'DESC',
    search: search as string,
    filters: filters as Record<string, any>
  };

  const result = await serviceRequestService.listRequests(options);
  res.status(200).json({
    status: 'success',
    results: result.data.length,
    total: result.total,
    data: { requests: result.data }
  });
});

export const getServiceRequestDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const details = await serviceRequestService.getRequestDetails(id);
  res.status(200).json({
    status: 'success',
    data: details
  });
});

export const updateServiceRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;

  const request = await serviceRequestService.updateRequest(id, req.body, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    message: 'Service request updated successfully.',
    data: { request }
  });
});

export const deleteServiceRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;

  await serviceRequestService.deleteRequest(id, userId, userName, userRole);
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const assignServiceRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // requestId
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;

  const assignment = await serviceRequestService.assignRequest(id, req.body, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    message: 'Lead service engineer assigned successfully.',
    data: { assignment }
  });
});

export const updateServiceRequestStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // requestId
  const { status, notes } = req.body;
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;

  const request = await serviceRequestService.updateStatus(id, status, notes, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    message: `Service request status advanced to ${status}.`,
    data: { request }
  });
});

export const updateServiceRequestBilling = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // requestId
  const { estimatedCost, billingApproved } = req.body;
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;

  const request = await serviceRequestService.updateBilling(id, parseFloat(estimatedCost), !!billingApproved, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    message: 'Service ticket costing and billing authorization updated.',
    data: { request }
  });
});
