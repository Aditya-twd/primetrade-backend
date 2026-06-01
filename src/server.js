import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { seedAdmin } from './utils/seedAdmin.js';

async function start() {
  await connectDB();
  await seedAdmin();

  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info(`API listening on http://localhost:${env.port} (${env.nodeEnv})`);
    logger.info(`Swagger docs at http://localhost:${env.port}/api/v1/docs`);
  });

  // Graceful shutdown so in-flight requests drain and the DB closes cleanly.
  const shutdown = (signal) => {
    logger.warn(`${signal} received, shutting down...`);
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  logger.error('Fatal startup error', err);
  process.exit(1);
});
