import type { MiddlewareHandler } from 'hono';
import { fail } from '../lib/response.js';
import { logger } from '../lib/logger.js';
import { HttpError } from '../lib/http-error.js';

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn('Handled backend error', {
        path: c.req.path,
        method: c.req.method,
        code: error.code,
        requestId: c.get('requestId'),
      });

      return fail(c, error.status, error.code, error.message, error.details);
    }

    logger.error('Unhandled backend error', {
      path: c.req.path,
      method: c.req.method,
      error: error instanceof Error ? error.message : 'unknown_error',
      requestId: c.get('requestId'),
    });

    return fail(c, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
  }
};
