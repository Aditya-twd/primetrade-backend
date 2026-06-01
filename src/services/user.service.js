import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const userService = {
  async list({ page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      User.find().sort('-createdAt').skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
  },

  async updateRole(targetId, role, actor) {
    if (targetId === actor.id) {
      throw ApiError.badRequest('You cannot change your own role');
    }
    const user = await User.findByIdAndUpdate(targetId, { role }, { new: true, runValidators: true });
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },
};
