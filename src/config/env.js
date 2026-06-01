import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized, validated environment configuration.
 * Fail fast at boot if a required secret is missing.
 */
const required = (key, fallback) => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const isTest = process.env.NODE_ENV === 'test';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest,
  port: parseInt(process.env.PORT || '5000', 10),

  mongoUri: required('MONGO_URI', isTest ? 'mongodb://localhost:27017/primetrade_test' : 'mongodb://localhost:27017/primetrade'),

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', isTest ? 'test_access_secret' : undefined),
    refreshSecret: required('JWT_REFRESH_SECRET', isTest ? 'test_refresh_secret' : undefined),
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  },

  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  seedAdmin: {
    email: process.env.SEED_ADMIN_EMAIL || 'admin@primetrade.ai',
    password: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
    name: process.env.SEED_ADMIN_NAME || 'Site Admin',
  },
};
