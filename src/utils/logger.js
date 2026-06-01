import { env } from '../config/env.js';

/**
 * Tiny structured logger. In a real deployment this would be pino/winston
 * shipping JSON to a log aggregator; kept dependency-free here.
 */
const ts = () => new Date().toISOString();

const write = (level, args) => {
  if (env.isTest && level === 'info') return; // keep test output clean
  const line = `[${ts()}] ${level.toUpperCase()}`;
  // eslint-disable-next-line no-console
  console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](line, ...args);
};

export const logger = {
  info: (...args) => write('info', args),
  warn: (...args) => write('warn', args),
  error: (...args) => write('error', args),
};
