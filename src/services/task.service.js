import { Task } from '../models/Task.js';
import { ROLES } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Ownership rule: a regular user only ever sees/touches their own tasks; an
 * admin can act on any task. Centralized here so every entry point is consistent.
 */
function ownershipFilter(actor, extra = {}) {
  if (actor.role === ROLES.ADMIN) return { ...extra };
  return { ...extra, owner: actor.id };
}

export const taskService = {
  async list(actor, { page = 1, limit = 10, status, priority, sort = '-createdAt', q } = {}) {
    const filter = ownershipFilter(actor);
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (q) filter.title = { $regex: q, $options: 'i' };

    const skip = (page - 1) * limit;
    let query = Task.find(filter).sort(sort).skip(skip).limit(limit);
    // Admins see every user's tasks, so surface who owns each one (name + email).
    if (actor.role === ROLES.ADMIN) query = query.populate('owner', 'name email');

    const [items, total] = await Promise.all([query, Task.countDocuments(filter)]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  },

  async getOne(actor, id) {
    let query = Task.findOne(ownershipFilter(actor, { _id: id }));
    if (actor.role === ROLES.ADMIN) query = query.populate('owner', 'name email');
    const task = await query;
    if (!task) throw ApiError.notFound('Task not found');
    return task;
  },

  async create(actor, data) {
    return Task.create({ ...data, owner: actor.id });
  },

  async update(actor, id, data) {
    const task = await Task.findOneAndUpdate(
      ownershipFilter(actor, { _id: id }),
      data,
      { new: true, runValidators: true }
    );
    if (!task) throw ApiError.notFound('Task not found');
    return task;
  },

  async remove(actor, id) {
    const task = await Task.findOneAndDelete(ownershipFilter(actor, { _id: id }));
    if (!task) throw ApiError.notFound('Task not found');
    return task;
  },
};
