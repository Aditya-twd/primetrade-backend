import { body, param, query } from 'express-validator';
import { TASK_STATUS, TASK_PRIORITY } from '../models/Task.js';

const statuses = Object.values(TASK_STATUS);
const priorities = Object.values(TASK_PRIORITY);

export const createTaskRules = [
  body('title').isString().trim().isLength({ min: 1, max: 140 }).withMessage('Title is required (max 140 chars)'),
  body('description').optional().isString().trim().isLength({ max: 2000 }).withMessage('Description too long'),
  body('status').optional().isIn(statuses).withMessage(`Status must be one of: ${statuses.join(', ')}`),
  body('priority').optional().isIn(priorities).withMessage(`Priority must be one of: ${priorities.join(', ')}`),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('dueDate must be an ISO-8601 date'),
];

export const updateTaskRules = [
  param('id').isMongoId().withMessage('Invalid task id'),
  body('title').optional().isString().trim().isLength({ min: 1, max: 140 }).withMessage('Title max 140 chars'),
  body('description').optional().isString().trim().isLength({ max: 2000 }).withMessage('Description too long'),
  body('status').optional().isIn(statuses).withMessage(`Status must be one of: ${statuses.join(', ')}`),
  body('priority').optional().isIn(priorities).withMessage(`Priority must be one of: ${priorities.join(', ')}`),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('dueDate must be an ISO-8601 date'),
];

export const idParamRules = [param('id').isMongoId().withMessage('Invalid task id')];

export const listTaskRules = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(statuses),
  query('priority').optional().isIn(priorities),
  query('sort').optional().isIn(['createdAt', '-createdAt', 'dueDate', '-dueDate', 'priority', '-priority']),
  query('q').optional().isString().trim().isLength({ max: 140 }),
];
