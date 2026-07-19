import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    passwordPlain: z.string().min(6, 'Password must be at least 6 characters long'),
    tags: z.array(z.string()).optional(),
    avatarUrl: z.string().optional(),
    territory: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').optional(),
    name: z.string().min(1, 'Name cannot be empty').optional(),
    role: z.string().min(1, 'Role cannot be empty').optional(),
    passwordPlain: z.string().min(6, 'Password must be at least 6 characters long').optional().or(z.literal('')),
    tags: z.array(z.string()).optional(),
    avatarUrl: z.string().optional(),
    territory: z.string().optional(),
  }),
});

export const createPermissionSchema = z.object({
  body: z.object({
    code: z
      .string()
      .min(2, 'Permission code must be at least 2 characters')
      .regex(/^[a-zA-Z0-9_:-]+$/, 'Code must be alphanumeric, colons, underscores or hyphens only'),
    description: z.string().optional(),
  }),
});

export const rolePermissionSchema = z.object({
  body: z.object({
    roleName: z.string().min(1, 'Role name is required'),
    permissionCode: z.string().min(1, 'Permission code is required'),
  }),
});
