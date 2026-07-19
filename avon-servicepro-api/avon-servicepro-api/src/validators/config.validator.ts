import { z } from 'zod';

export const updateSystemSettingSchema = z.object({
  body: z.object({
    key: z.string().min(1, 'Key is required'),
    value: z.string().min(1, 'Value is required'),
    category: z.string().min(1, 'Category is required'),
  }),
});

export const updateConfigurationSchema = z.object({
  body: z.object({
    key: z.string().min(1, 'Key is required'),
    value: z.string().min(1, 'Value is required'),
    type: z.enum(['string', 'number', 'boolean', 'json']),
    description: z.string().optional(),
    isEncrypted: z.boolean().optional(),
  }),
});

export const createVersionEntrySchema = z.object({
  body: z.object({
    appVersion: z.string().min(1, 'App version is required'),
    apiVersion: z.string().min(1, 'API version is required'),
    releaseDate: z.string().min(1, 'Release date is required'),
    status: z.enum(['ACTIVE', 'DEPRECATED', 'DEVELOPMENT']),
    changelog: z.string().optional(),
  }),
});

export const updateVersionEntrySchema = z.object({
  body: z.object({
    appVersion: z.string().min(1, 'App version cannot be empty').optional(),
    apiVersion: z.string().min(1, 'API version cannot be empty').optional(),
    releaseDate: z.string().min(1, 'Release date cannot be empty').optional(),
    status: z.enum(['ACTIVE', 'DEPRECATED', 'DEVELOPMENT']).optional(),
    changelog: z.string().optional(),
  }),
});

export const createLookupItemSchema = z.object({
  body: z.object({
    type: z.string().min(1, 'Type is required'),
    code: z
      .string()
      .min(1, 'Code is required')
      .regex(/^[a-zA-Z0-9_:-]+$/, 'Code must be alphanumeric, colons, underscores or hyphens only'),
    value: z.string().min(1, 'Display value is required'),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

export const updateLookupItemSchema = z.object({
  body: z.object({
    code: z
      .string()
      .min(1, 'Code cannot be empty')
      .regex(/^[a-zA-Z0-9_:-]+$/, 'Code must be alphanumeric, colons, underscores or hyphens only')
      .optional(),
    value: z.string().min(1, 'Display value cannot be empty').optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }),
});
