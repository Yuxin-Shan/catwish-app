import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../lib/env.js';

let pool: Pool | null = null;

const createPool = () =>
  new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : false,
  });

export const getPool = () => {
  if (!pool) {
    pool = createPool();
  }

  return pool;
};

export const db = drizzle(getPool());

export const getDatabaseConfigSummary = () => ({
  configured: Boolean(env.DATABASE_URL),
  ssl: env.DATABASE_SSL,
});
