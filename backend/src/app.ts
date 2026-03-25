import { Hono } from 'hono';
import { requestIdMiddleware } from './middlewares/request-id.js';
import { errorHandler } from './middlewares/error-handler.js';
import { fail, ok } from './lib/response.js';
import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth.js';
import { analysisRoutes } from './routes/analysis.js';

export type AppBindings = {
  Variables: {
    requestId: string;
  };
};

export const app = new Hono<AppBindings>();

app.use('*', requestIdMiddleware);
app.use('*', errorHandler);

app.get('/', (c) =>
  ok(c, {
    service: 'catwish-backend',
    status: 'bootstrapped',
  })
);

app.route('/v1', healthRoutes);
app.route('/v1', authRoutes);
app.route('/v1', analysisRoutes);

app.notFound((c) => fail(c, 404, 'NOT_FOUND', 'Route not found'));
