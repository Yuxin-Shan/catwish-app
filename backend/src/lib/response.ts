import type { Context } from 'hono';

export interface SuccessEnvelope<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const ok = <T>(c: Context, data: T, meta?: Record<string, unknown>) => {
  const body: SuccessEnvelope<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };

  return c.json(body);
};

export const fail = (
  c: Context,
  status: number,
  code: string,
  message: string,
  details?: unknown
) => {
  const body: ErrorEnvelope = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };

  return c.json(body, status as 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500);
};
