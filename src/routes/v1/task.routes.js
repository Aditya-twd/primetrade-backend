import { Router } from 'express';
import { taskController } from '../../controllers/task.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  createTaskRules,
  updateTaskRules,
  idParamRules,
  listTaskRules,
} from '../../validators/task.validator.js';

const router = Router();

// Every task route requires a valid access token.
router.use(authenticate);

/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks (own tasks; all tasks if admin) — paginated & filterable
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *       - { in: query, name: status, schema: { type: string, enum: [todo, in_progress, done] } }
 *       - { in: query, name: priority, schema: { type: string, enum: [low, medium, high] } }
 *       - { in: query, name: q, schema: { type: string }, description: title search }
 *       - { in: query, name: sort, schema: { type: string, default: '-createdAt' } }
 *     responses:
 *       200: { description: Paginated list of tasks }
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TaskInput' }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 */
router
  .route('/')
  .get(validate(listTaskRules), taskController.list)
  .post(validate(createTaskRules), taskController.create);

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get a single task by id
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Task }
 *       404: { description: Not found }
 *   patch:
 *     tags: [Tasks]
 *     summary: Update a task (owner or admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TaskInput' }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task (owner or admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router
  .route('/:id')
  .get(validate(idParamRules), taskController.getOne)
  .patch(validate(updateTaskRules), taskController.update)
  .delete(validate(idParamRules), taskController.remove);

export default router;
