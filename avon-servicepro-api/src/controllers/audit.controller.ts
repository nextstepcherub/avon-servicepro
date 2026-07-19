import { Request, Response } from 'express';
import { auditRepository } from '../repositories/audit.repository';
import { asyncHandler } from '../utils/asyncHandler';

export const listAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset, sortBy, sortOrder, search, userId } = req.query;
  const options = {
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'ASC' | 'DESC',
    search: search as string,
    filters: { userId },
  };
  
  const result = await auditRepository.findAll(options);
  res.status(200).json({
    status: 'success',
    results: result.data.length,
    total: result.total,
    data: { audits: result.data },
  });
});
