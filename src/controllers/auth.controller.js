import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { env } from '../config/env.js';

const REFRESH_COOKIE = 'refreshToken';

// httpOnly so JS can't read it (XSS-resistant).
// In production the frontend (Vercel) and API are on different origins, so the
// cookie must be SameSite=None + Secure to be sent cross-site. In dev (same-site,
// http://localhost) we use Strict + non-secure so the cookie works over http.
function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'strict',
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  };
}

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, refreshCookieOptions());
}

export const authController = {
  register: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const { user, tokens } = await authService.register({ name, email, password });
    setRefreshCookie(res, tokens.refreshToken);
    sendSuccess(res, {
      statusCode: 201,
      message: 'Registration successful',
      data: { user, accessToken: tokens.accessToken },
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, tokens } = await authService.login({ email, password });
    setRefreshCookie(res, tokens.refreshToken);
    sendSuccess(res, {
      message: 'Login successful',
      data: { user, accessToken: tokens.accessToken },
    });
  }),

  refresh: asyncHandler(async (req, res) => {
    const { user, tokens } = await authService.refresh(req.cookies?.[REFRESH_COOKIE]);
    setRefreshCookie(res, tokens.refreshToken);
    sendSuccess(res, { message: 'Token refreshed', data: { accessToken: tokens.accessToken } });
  }),

  logout: asyncHandler(async (_req, res) => {
    res.clearCookie(REFRESH_COOKIE, { ...refreshCookieOptions(), maxAge: undefined });
    sendSuccess(res, { message: 'Logged out' });
  }),

  me: asyncHandler(async (req, res) => {
    const user = await authService.getById(req.user.id);
    sendSuccess(res, { message: 'Current user', data: { user } });
  }),
};
