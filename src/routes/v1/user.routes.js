import { Router } from 'express';
import { userController } from '../../controllers/user.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { validate } from '../../middleware/validate.js';
import { ROLES } from '../../models/User.js';
import { updateRoleRules } from '../../validators/user.validator.js';

const router = Router();

// Admin-only management endpoints.
router.use(authenticate, authorize(ROLES.ADMIN));

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (admin only)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Paginated list of users }
 *       403: { description: Forbidden }
 */
router.get('/', userController.list);

/**
 * @openapi
 * /users/{id}/role:
 *   patch:
 *     tags: [Users]
 *     summary: Change a user's role (admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: { role: { type: string, enum: [user, admin] } }
 *     responses:
 *       200: { description: Updated }
 *       403: { description: Forbidden }
 */
router.patch('/:id/role', validate(updateRoleRules), userController.updateRole);

export default router;
