import { Hono } from 'hono';
import { env } from '../lib/env.js';
import { ok } from '../lib/response.js';
import { getDatabaseConfigSummary } from '../db/client.js';

export const healthRoutes = new Hono();

healthRoutes.get('/health', (c) =>
  ok(c, {
    status: 'ok',
    service: 'catwish-backend',
    environment: env.NODE_ENV,
    version: env.APP_VERSION,
    database: getDatabaseConfigSummary(),
  })
);

healthRoutes.get('/version', (c) =>
  ok(c, {
    version: env.APP_VERSION,
  })
);
