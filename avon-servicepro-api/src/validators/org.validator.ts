import { z } from 'zod';

export const createOrgUnitSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required and cannot be empty'),
    code: z
      .string()
      .min(2, 'Code must be at least 2 characters')
      .regex(/^[a-zA-Z0-9_:-]+$/, 'Code must be alphanumeric, colons, underscores or hyphens only'),
    type: z.enum(['COMPANY', 'BRANCH', 'DEPARTMENT', 'UNIT']),
    parentId: z.string().optional().or(z.literal('')),
    managerId: z.string().optional().or(z.literal('')),
  }),
});

export const updateOrgUnitSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    code: z
      .string()
      .min(2, 'Code must be at least 2 characters')
      .regex(/^[a-zA-Z0-9_:-]+$/, 'Code must be alphanumeric, colons, underscores or hyphens only')
      .optional(),
    type: z.enum(['COMPANY', 'BRANCH', 'DEPARTMENT', 'UNIT']).optional(),
    parentId: z.string().optional().or(z.literal('')),
    managerId: z.string().optional().or(z.literal('')),
  }),
});
