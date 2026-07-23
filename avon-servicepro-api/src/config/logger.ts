import winston from 'winston';
import { config } from './environment';

const levels = {
  error: 0,
  security: 1,
  audit: 2,
  warn: 3,
  info: 4,
  http: 5,
  debug: 6,
};

const colors = {
  error: 'red',
  security: 'redBG white',
  audit: 'cyan',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'gray',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const metaStr = info.meta ? ` | Meta: ${JSON.stringify(info.meta)}` : '';
    return `[${info.timestamp}] [${info.level}]: ${info.message}${metaStr}`;
  })
);

const transports = [
  new winston.transports.Console({
    format,
  }),
];

export interface CustomLogger extends winston.Logger {
  error: winston.LeveledLogMethod;
  security: (message: string, meta?: any) => winston.Logger;
  audit: (message: string, meta?: any) => winston.Logger;
  warn: winston.LeveledLogMethod;
  info: winston.LeveledLogMethod;
  http: winston.LeveledLogMethod;
  debug: winston.LeveledLogMethod;
}

const baseLogger = winston.createLogger({
  level: config?.log?.level || 'debug',
  levels,
  transports,
});

// Attach typed methods for custom audit and security log levels
(baseLogger as any).audit = function (message: string, meta?: any) {
  return baseLogger.log('audit', message, meta ? { meta } : undefined);
};

(baseLogger as any).security = function (message: string, meta?: any) {
  return baseLogger.log('security', message, meta ? { meta } : undefined);
};

export const logger = baseLogger as CustomLogger;

