import { Router } from 'express';
import authRoutes from './auth.routes.js';
import taskRoutes from './task.routes.js';
import userRoutes from './user.routes.js';
import { sendSuccess } from '../../utils/ApiResponse.js';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Liveness/health check
 *     responses:
 *       200: { description: Service is healthy }
 */
router.get('/health', (_req, res) =>
  sendSuccess(res, { message: 'ok', data: { status: 'healthy', version: 'v1' } })
);

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);

export default router;
