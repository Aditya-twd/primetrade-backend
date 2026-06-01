import { User, ROLES } from '../models/User.js';
import { env } from '../config/env.js';
import { logger } from './logger.js';

/**
 * Idempotently ensure an admin account exists so the app is usable on first boot.
 * Safe to call on every start — it no-ops if the admin already exists.
 */
export async function seedAdmin() {
  const { email, password, name } = env.seedAdmin;
  const existing = await User.findOne({ email });
  if (existing) return;

  await User.create({ name, email, password, role: ROLES.ADMIN });
  logger.info(`Seeded admin user: ${email}`);
}
