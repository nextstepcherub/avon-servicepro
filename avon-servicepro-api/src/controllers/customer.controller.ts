import { Request, Response } from 'express';
import { customerService } from '../services/customer.service';
import { customerRepository } from '../repositories/customer.repository';
import { asyncHandler } from '../utils/asyncHandler';

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const userName = req.user?.name as string;
  const userRole = req.user?.role as string;
  
  const customer = await customerService.createCustomer(req.body, userId, userName, userRole);
  res.status(201).json({
    status: 'success',
    data: { customer },
  });
});

export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await customerService.getCustomerProfile(id);
  res.status(200).json({
    status: 'success',
    data: { customer },
  });
});

export const listCustomers = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset, sortBy, sortOrder, search } = req.query;
  const options = {
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'ASC' | 'DESC',
    search: search as string,
  };
  
  const result = await customerRepository.findAll(options);
  res.status(200).json({
    status: 'success',
    results: result.data.length,
    total: result.total,
    data: { customers: result.data },
  });
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await customerRepository.update(id, req.body);
  res.status(200).json({
    status: 'success',
    data: { customer },
  });
});

export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await customerRepository.delete(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
