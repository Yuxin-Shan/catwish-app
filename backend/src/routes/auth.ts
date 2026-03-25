import { Context, Hono } from 'hono';
import { ok } from '../lib/response.js';
import { authService } from '../services/auth-service.js';

export const authRoutes = new Hono();

const getRequestContext = (c: Context) => ({
  userAgent: c.req.header('user-agent') ?? null,
  ipAddress:
    c.req.header('x-forwarded-for') ??
    c.req.header('x-real-ip') ??
    null,
});

authRoutes.post('/auth/register', async (c) => {
  const body = await c.req.json();
  const session = await authService.register(body, getRequestContext(c));
  return ok(c, session);
});

authRoutes.post('/auth/login', async (c) => {
  const body = await c.req.json();
  const session = await authService.login(body, getRequestContext(c));
  return ok(c, session);
});

authRoutes.post('/auth/refresh', async (c) => {
  const body = await c.req.json();
  const session = await authService.refresh(body, getRequestContext(c));
  return ok(c, session);
});

authRoutes.post('/auth/logout', async (c) => {
  const body = await c.req.json();
  const result = await authService.logout(body);
  return ok(c, result);
});

authRoutes.post('/auth/logout-all', async (c) => {
  const body = await c.req.json();
  const result = await authService.logoutAll(body);
  return ok(c, result);
});
