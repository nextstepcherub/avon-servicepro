import { z } from 'zod';

export const updateSystemSettingSchema = z.object({
  body: z.object({
    key: z.string().min(1),
    value: z.string().min(1),
    category: z.string().optional(),
  })
});

export const updateConfigurationSchema = z.object({
  body: z.object({
    key: z.string().min(1),
    value: z.string().min(1),
    type: z.enum(['string', 'number', 'boolean']).optional(),
    isEncrypted: z.boolean().optional(),
  })
});

export const createVersionEntrySchema = z.object({
  body: z.object({
    version: z.string().min(1),
    description: z.string().optional(),
    releaseDate: z.string().optional(),
  })
});

export const updateVersionEntrySchema = z.object({
  body: z.object({
    version: z.string().optional(),
    description: z.string().optional(),
    releaseDate: z.string().optional(),
  }).partial()
});

export const createLookupItemSchema = z.object({
  body: z.object({
    type: z.string().min(1),
    code: z.string().regex(/^[a-zA-Z0-9_]+$/, 'Code can only contain alphanumeric characters and underscores'),
    value: z.string().min(1),
    sortOrder: z.number().optional(),
  })
});

export const updateLookupItemSchema = z.object({
  body: z.object({
    type: z.string().optional(),
    code: z.string().regex(/^[a-zA-Z0-9_]+$/, 'Code can only contain alphanumeric characters and underscores').optional(),
    value: z.string().optional(),
    sortOrder: z.number().optional(),
    isActive: z.boolean().optional(),
  }).partial()
});
