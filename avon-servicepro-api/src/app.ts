import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import path from 'path';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import { corsMiddleware, securityHeadersMiddleware, payloadSizeErrorHandler } from './middlewares/security';
import { globalRateLimiter } from './middlewares/rateLimiter';
import { config } from './config/environment';
import { dbPool } from './config/database';
import { requestContextStorage } from './utils/requestContext';
import { NotFoundError } from './utils/apiError';
import apiRouter from './routes';


const app: Express = express();

// Request Context storage middleware (must be very first to wrap entire request execution flow)
app.use((req: Request, res: Response, next: NextFunction) => {
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'System / Direct';
  
  requestContextStorage.run({ ipAddress, userAgent }, () => {
    next();
  });
});

// Set Helmet Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for Vite Dev Server / SPA compatibility
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Custom Security Headers
app.use(securityHeadersMiddleware);

// Enable CORS Whitelist
app.use(corsMiddleware);

// Global Rate Limiting
app.use('/api', globalRateLimiter);

// Request Logger
app.use(requestLogger);

// Parse JSON request body with 10mb limit
app.use(express.json({ limit: '10mb' }));

// Parse urlencoded request body with 10mb limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Handle Request Payload Size Limit Errors
app.use(payloadSizeErrorHandler);

// Core status check endpoint
app.get('/health', async (req: Request, res: Response) => {
  const isDbHealthy = await dbPool.testConnection().catch(() => false);
  const status = isDbHealthy ? 'success' : 'error';
  const statusCode = isDbHealthy ? 200 : 503;
  
  res.status(statusCode).json({
    status,
    timestamp: new Date().toISOString(),
    service: 'avon-servicepro-api',
    uptime: process.uptime(),
    database: isDbHealthy ? 'healthy' : 'unhealthy',
  });
});

// Mount versioned API routes
app.use(config.apiPrefix, apiRouter);

let vitePromise: Promise<any> | null = null;

function getViteMiddleware() {
  if (!vitePromise) {
    vitePromise = import('vite').then(({ createServer }) =>
      createServer({
        server: { middlewareMode: true },
        appType: 'spa',
      })
    );
  }
  return (req: Request, res: Response, next: any) => {
    vitePromise!
      .then((vite) => {
        vite.middlewares(req, res, next);
      })
      .catch(next);
  };
}

if (config.nodeEnv !== 'production') {
  app.use(getViteMiddleware());
} else {
  // Serve static frontend assets
  const distPath = path.join(__dirname, '../../dist');
  app.use(express.static(distPath));

  // Handle unknown routes or SPA fallback
  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.accepts('html')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}. Endpoint not found on this server.`));
    }
  });

}

// Global error handling middleware
app.use(errorHandler);

export default app;
