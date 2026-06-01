import { taskService } from '../services/task.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';

// Whitelist writable fields so clients can't set `owner`, timestamps, etc.
function pickTaskFields(body) {
  const { title, description, status, priority, dueDate } = body;
  const data = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (status !== undefined) data.status = status;
  if (priority !== undefined) data.priority = priority;
  if (dueDate !== undefined) data.dueDate = dueDate;
  return data;
}

export const taskController = {
  list: asyncHandler(async (req, res) => {
    const { items, meta } = await taskService.list(req.user, {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      status: req.query.status,
      priority: req.query.priority,
      sort: req.query.sort || '-createdAt',
      q: req.query.q,
    });
    sendSuccess(res, { message: 'Tasks fetched', data: items, meta });
  }),

  getOne: asyncHandler(async (req, res) => {
    const task = await taskService.getOne(req.user, req.params.id);
    sendSuccess(res, { message: 'Task fetched', data: task });
  }),

  create: asyncHandler(async (req, res) => {
    const task = await taskService.create(req.user, pickTaskFields(req.body));
    sendSuccess(res, { statusCode: 201, message: 'Task created', data: task });
  }),

  update: asyncHandler(async (req, res) => {
    const task = await taskService.update(req.user, req.params.id, pickTaskFields(req.body));
    sendSuccess(res, { message: 'Task updated', data: task });
  }),

  remove: asyncHandler(async (req, res) => {
    await taskService.remove(req.user, req.params.id);
    sendSuccess(res, { message: 'Task deleted', data: { id: req.params.id } });
  }),
};
