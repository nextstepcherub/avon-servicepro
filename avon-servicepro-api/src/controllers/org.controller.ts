import { Request, Response } from 'express';
import { orgService } from '../services/org.service';
import { asyncHandler } from '../utils/asyncHandler';

export const createOrgUnit = asyncHandler(async (req: Request, res: Response) => {
  const orgUnit = await orgService.createOrgUnit(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Organizational unit created successfully.',
    data: { orgUnit },
  });
});

export const getOrgUnitById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const orgUnit = await orgService.getOrgUnitById(id);
  res.status(200).json({
    status: 'success',
    data: { orgUnit },
  });
});

export const listOrgUnits = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset, sortBy, sortOrder, type, parentId } = req.query;
  const options = {
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'ASC' | 'DESC',
    filters: {
      type: type as string,
      parentId: parentId as string,
    },
  };

  const result = await orgService.listOrgUnits(options);
  res.status(200).json({
    status: 'success',
    results: result.data.length,
    total: result.total,
    data: { orgUnits: result.data },
  });
});

export const updateOrgUnit = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const orgUnit = await orgService.updateOrgUnit(id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Organizational unit updated successfully.',
    data: { orgUnit },
  });
});

export const deleteOrgUnit = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await orgService.deleteOrgUnit(id);
  res.status(200).json({
    status: 'success',
    message: 'Organizational unit deleted successfully.',
  });
});

export const getOrgTree = asyncHandler(async (req: Request, res: Response) => {
  const tree = await orgService.getOrgTree();
  res.status(200).json({
    status: 'success',
    data: { tree },
  });
});
