import { userService } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';

export const userController = {
  list: asyncHandler(async (req, res) => {
    const { items, meta } = await userService.list({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    });
    sendSuccess(res, { message: 'Users fetched', data: items, meta });
  }),

  updateRole: asyncHandler(async (req, res) => {
    const user = await userService.updateRole(req.params.id, req.body.role, req.user);
    sendSuccess(res, { message: 'Role updated', data: { user } });
  }),
};
