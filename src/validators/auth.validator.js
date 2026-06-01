import { body } from 'express-validator';

const password = body('password')
  .isString()
  .isLength({ min: 8, max: 72 })
  .withMessage('Password must be 8-72 characters')
  .matches(/[a-z]/)
  .withMessage('Password must contain a lowercase letter')
  .matches(/[A-Z]/)
  .withMessage('Password must contain an uppercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain a number');

export const registerRules = [
  body('name').isString().trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  password,
];

export const loginRules = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isString().notEmpty().withMessage('Password is required'),
];
