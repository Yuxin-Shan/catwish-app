import type { MiddlewareHandler } from 'hono';

const generateRequestId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `req_${Date.now()}`;

export const requestIdMiddleware: MiddlewareHandler = async (c, next) => {
  const requestId = c.req.header('x-request-id') ?? generateRequestId();

  c.set('requestId', requestId);
  c.res.headers.set('x-request-id', requestId);

  await next();
};
