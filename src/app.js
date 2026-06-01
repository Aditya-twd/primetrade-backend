import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import v1Routes from './routes/v1/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiter.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1); // correct client IPs behind a proxy/load balancer

  // ── Security & parsing ────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        // Allow same-origin / curl (no Origin) and any whitelisted origin.
        // For a disallowed origin we return false (no CORS headers → browser
        // blocks it) rather than throwing, which would surface as a 500.
        cb(null, !origin || env.corsOrigins.includes(origin));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(mongoSanitize()); // strip $ / . from keys → blocks Mongo operator injection

  if (!env.isTest) app.use(morgan(env.isProd ? 'combined' : 'dev'));

  // ── Docs ──────────────────────────────────────────────
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  app.get('/api/v1/docs.json', (_req, res) => res.json(swaggerSpec));

  // ── API ───────────────────────────────────────────────
  app.use('/api', globalLimiter);
  app.use('/api/v1', v1Routes);

  app.get('/', (_req, res) =>
    res.json({ name: 'Primetrade.ai API', docs: '/api/v1/docs', health: '/api/v1/health' })
  );

  // ── Errors ────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
