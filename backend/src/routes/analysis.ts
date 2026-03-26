import { Hono } from 'hono';
import { ok } from '../lib/response.js';
import { analysisService } from '../services/analysis-service.js';

export const analysisRoutes = new Hono();

analysisRoutes.post('/analysis', async (c) => {
  const body = await c.req.json();
  const analysis = await analysisService.create(body);
  return ok(c, analysis);
});

analysisRoutes.get('/analysis', async (c) => {
  const analyses = await analysisService.list({
    status: c.req.query('status'),
    limit: c.req.query('limit'),
  });

  return ok(c, analyses);
});

analysisRoutes.get('/analysis/:analysisId', async (c) => {
  const analysis = await analysisService.getById(c.req.param('analysisId'));
  return ok(c, analysis);
});
