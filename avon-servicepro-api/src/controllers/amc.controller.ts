import { Request, Response } from 'express';
import { amcService } from '../services/amc.service';
import { asyncHandler } from '../utils/asyncHandler';

export const createAmcContract = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user?.id || 'usr-admin') as string;
  const userName = (req.user?.name || 'System Admin') as string;
  const userRole = (req.user?.role || 'Admin') as string;

  const contract = await amcService.createContract(req.body, userId, userName, userRole);
  res.status(201).json({
    status: 'success',
    data: { contract }
  });
});

export const getAmcContract = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const contract = await amcService.getContractById(id);
  res.status(200).json({
    status: 'success',
    data: { contract }
  });
});

export const listAmcContracts = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset, sortBy, sortOrder, customerId, status } = req.query;
  const filters: Record<string, any> = {};
  
  if (customerId) filters.customerId = customerId;
  if (status) filters.status = status;

  const options = {
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'ASC' | 'DESC',
    filters: Object.keys(filters).length > 0 ? filters : undefined
  };

  const result = await amcService.getAllContracts(options);
  res.status(200).json({
    status: 'success',
    data: result.data,
    total: result.total
  });
});

export const updateAmcContract = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user?.id || 'usr-admin') as string;
  const userName = (req.user?.name || 'System Admin') as string;
  const userRole = (req.user?.role || 'Admin') as string;

  const contract = await amcService.updateContract(id, req.body, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    data: { contract }
  });
});

export const renewAmcContract = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user?.id || 'usr-admin') as string;
  const userName = (req.user?.name || 'System Admin') as string;
  const userRole = (req.user?.role || 'Admin') as string;

  const contract = await amcService.renewContract(id, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    data: { contract }
  });
});

export const deleteAmcContract = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user?.id || 'usr-admin') as string;
  const userName = (req.user?.name || 'System Admin') as string;
  const userRole = (req.user?.role || 'Admin') as string;

  const success = await amcService.deleteContract(id, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    data: { success }
  });
});

export const getAmcSlaStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await amcService.getSlaComplianceStats();
  res.status(200).json({
    status: 'success',
    data: stats
  });
});
