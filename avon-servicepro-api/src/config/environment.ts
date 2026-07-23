import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root and relative .env files
dotenv.config({ path: path.join(process.cwd(), '.env'), override: true });
dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });

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
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
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
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },
};
