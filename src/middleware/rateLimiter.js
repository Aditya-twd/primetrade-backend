import rateLimit from 'express-rate-limit';

const handler = (_req, res) =>
  res.status(429).json({ success: false, message: 'Too many requests, please try again later.' });

/** Global limiter applied to all /api traffic. */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

/** Stricter limiter for auth endpoints to blunt credential stuffing/brute force. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  // Don't count successful logins/registrations against the limit.
  skipSuccessfulRequests: true,
});
