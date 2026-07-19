import { Request, Response } from 'express';
import { assetService } from '../services/asset.service';
import { assetRepository } from '../repositories/asset.repository';
import { asyncHandler } from '../utils/asyncHandler';

export const registerAsset = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;
  
  const asset = await assetService.registerAsset(req.body, userId, userName, userRole);
  res.status(201).json({
    status: 'success',
    data: { asset },
  });
});

export const getAssetById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const asset = await assetService.getAsset(id);
  res.status(200).json({
    status: 'success',
    data: { asset },
  });
});

export const listAssets = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset, sortBy, sortOrder, search, ...filters } = req.query;
  const options = {
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'ASC' | 'DESC',
    search: search as string,
    filters: filters as Record<string, any>,
  };
  
  const result = await assetRepository.findAll(options);
  res.status(200).json({
    status: 'success',
    results: result.data.length,
    total: result.total,
    data: { assets: result.data },
  });
});

export const updateAsset = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;
  
  const asset = await assetService.updateAsset(id, req.body, userId, userName, userRole);
  res.status(200).json({
    status: 'success',
    data: { asset },
  });
});

export const deleteAsset = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await assetRepository.delete(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
