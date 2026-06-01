import { ApiError } from '../utils/ApiError.js';

/**
 * Role gate. Use after `authenticate`:
 *   router.get('/users', authenticate, authorize('admin'), handler)
 */
export const authorize =
  (...allowedRoles) =>
  (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    next();
  };
