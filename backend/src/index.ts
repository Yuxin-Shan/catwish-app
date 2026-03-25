import { serve } from '@hono/node-server';
import { app } from './app.js';
import { env } from './lib/env.js';
import { logger } from './lib/logger.js';

const port = env.PORT;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    logger.info('Backend server started', {
      port: info.port,
      environment: env.NODE_ENV,
      version: env.APP_VERSION,
    });
  }
);
