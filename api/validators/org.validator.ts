import { z } from 'zod';

export const createOrgUnitSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    code: z.string().regex(/^[a-zA-Z0-9_]+$/, 'Code can only contain alphanumeric characters and underscores'),
    type: z.enum(['COMPANY', 'BRANCH', 'DEPARTMENT']),
    parentId: z.string().optional().nullable(),
  })
});

export const updateOrgUnitSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    code: z.string().regex(/^[a-zA-Z0-9_]+$/, 'Code can only contain alphanumeric characters and underscores').optional(),
    type: z.enum(['COMPANY', 'BRANCH', 'DEPARTMENT']).optional(),
    parentId: z.string().optional().nullable(),
  }).partial()
});
