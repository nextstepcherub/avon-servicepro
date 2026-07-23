import winston from 'winston';
import { config } from './environment';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => {
      const category = info.category ? ` [${info.category}]` : '';
      return `[${info.timestamp}] [${info.level}]${category}: ${info.message}`;
    },
  ),
);

const transports = [
  new winston.transports.Console({
    format,
  }),
];

export const logger = winston.createLogger({
  level: config.log.level,
  levels,
  transports,
});
