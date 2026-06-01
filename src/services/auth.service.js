import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

/** Issue a fresh access/refresh token pair for a user document. */
function issueTokens(user) {
  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
  };
}

export const authService = {
  async register({ name, email, password }) {
    const exists = await User.exists({ email });
    if (exists) throw ApiError.conflict('An account with that email already exists');

    const user = await User.create({ name, email, password });
    return { user, tokens: issueTokens(user) };
  },

  async login({ email, password }) {
    // password has `select: false`, so request it explicitly here.
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw ApiError.unauthorized('Invalid email or password');
    }
    return { user, tokens: issueTokens(user) };
  },

  async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.unauthorized('Missing refresh token');

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await User.findById(payload.sub);
    if (!user) throw ApiError.unauthorized('User no longer exists');

    return { user, tokens: issueTokens(user) };
  },

  async getById(id) {
    const user = await User.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },
};
