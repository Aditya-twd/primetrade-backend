import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

/**
 * Runs a list of express-validator chains, then collects errors into a single
 * 400 with a field-keyed details object the frontend can render inline.
 */
export const validate = (chains) => [
  ...chains,
  (req, _res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) return next();

    const details = {};
    for (const err of result.array()) {
      // express-validator v7 uses `path`
      const field = err.path || err.param || '_';
      if (!details[field]) details[field] = err.msg;
    }
    next(ApiError.badRequest('Validation failed', details));
  },
];
