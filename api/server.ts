import app from './app';
import { config } from './config/environment';
import { logger } from './config/logger';
import { dbPool } from './config/database';

async function bootstrap() {
  logger.info('====================================================');
  logger.info('  Avon ServicePro Enterprise API Service Booting...  ');
  logger.info('====================================================');
  
  try {
    // 1. Initialize DB Connection Pool
    await dbPool.initialize();
    
    // 2. Start Express HTTP Server
    const server = app.listen(config.port, '0.0.0.0', () => {
      logger.info(`HTTP Server successfully bound to port: ${config.port}`);
      logger.info(`Running environment: [${config.nodeEnv}]`);
      logger.info(`Versioned API Base: http://localhost:${config.port}${config.apiPrefix}`);
      logger.info('====================================================');
    });

    // Graceful Shutdown Handler
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown of Avon ServicePro API...`);
      
      server.close(async () => {
        logger.info('HTTP server closed.');
        await dbPool.end();
        logger.info('Database connections closed.');
        logger.info('Graceful shutdown completed successfully. Exiting.');
        process.exit(0);
      });
      
      // Force exit after 10 seconds if graceful shutdown hangs
      setTimeout(() => {
        logger.error('Graceful shutdown timed out. Forcing process exit.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('FATAL startup exception occurred! Terminating bootstrap procedure.');
    logger.error((error as Error).message);
    if ((error as Error).stack) {
      logger.error((error as Error).stack!);
    }
    process.exit(1);
  }
}

bootstrap();
