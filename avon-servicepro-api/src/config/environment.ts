import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env file with override enabled to prioritize local configurations
dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });

// Environment Schema Definition
const envSchema = z.object({
  PORT: z.string().optional().transform(v => parseInt(v || '3001', 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10, 'SUPABASE_SERVICE_ROLE_KEY is required and must be valid'),
  LOG_LEVEL: z.string().default('info'),
  LOG_FORMAT: z.string().default('combined'),
});

// Run validation on startup
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.warn('⚠️ Environment Validation Warnings:');
  parsedEnv.error.issues.forEach((issue) => {
    console.warn(`  - [${issue.path.join('.')}] ${issue.message}`);
  });
  
  if (process.env.NODE_ENV === 'production') {
    console.error('🛑 Critical environment variables are missing in production! Aborting startup.');
    process.exit(1);
  }
}

export interface Environment {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  apiPrefix: string;
  db: {
    host: string;
    port: number;
    user: string;
    pass: string;
    name: string;
    connectionLimit: number;
    ssl: boolean;
    sslRejectUnauthorized: boolean;
    sslCa?: string;
  };
  log: {
    level: string;
    format: string;
  };
}

export const config: Environment = {
  port: parsedEnv.success ? parsedEnv.data.PORT : parseInt(process.env.PORT || '3001', 10),
  nodeEnv: parsedEnv.success ? parsedEnv.data.NODE_ENV : ((process.env.NODE_ENV as any) || 'development'),
  apiPrefix: '/api',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'avon_servicepro_db',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
    ssl: process.env.DB_SSL === 'true',
    sslRejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
    sslCa: process.env.DB_SSL_CA || undefined,
  },
  log: {
    level: parsedEnv.success ? parsedEnv.data.LOG_LEVEL : (process.env.LOG_LEVEL || 'info'),
    format: parsedEnv.success ? parsedEnv.data.LOG_FORMAT : (process.env.LOG_FORMAT || 'combined'),
  },
};
