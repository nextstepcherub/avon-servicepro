import morgan from 'morgan';
import { logger } from '../config/logger';
import { config } from '../config/environment';

// Configure morgan stream to use winston logger
const stream = {
  write: (message: string) => logger.http(message.trim()),
};

// Skip logger for non-development environments or test (optional)
const skip = () => {
  return config.nodeEnv === 'test';
};

// Setup request logger middleware
export const requestLogger = morgan(
  config.log.format === 'dev' ? 'dev' : ':remote-addr - :method :url :status :res[content-length] - :response-time ms',
  { stream, skip },
);
