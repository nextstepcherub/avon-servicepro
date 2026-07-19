import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    passwordPlain: z.string().min(6, 'Password must be at least 6 characters long'),
    tags: z.array(z.string()).optional(),
  })
});

export const updateUserSchema = z.object({
  body: z.object({
    role: z.string().optional(),
    territory: z.string().optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    tags: z.array(z.string()).optional(),
  }).partial()
});

export const createPermissionSchema = z.object({
  body: z.object({
    code: z.string().regex(/^[a-zA-Z0-9:-]+$/, 'Permission code can only contain alphanumeric characters, colons, and hyphens'),
    description: z.string().optional(),
  })
});

export const rolePermissionSchema = z.object({
  body: z.object({
    roleName: z.string().min(1),
    permissionCode: z.string().min(1),
  })
});
