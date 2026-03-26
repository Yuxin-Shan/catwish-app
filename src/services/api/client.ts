import { API_CONFIG } from '../../config/api';

type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

const joinUrl = (baseUrl: string, path: string) => {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!API_CONFIG.ENABLE_BACKEND_API || !API_CONFIG.BACKEND_API_BASE_URL) {
    throw new Error('Backend API is not enabled');
  }

  const response = await fetch(joinUrl(API_CONFIG.BACKEND_API_BASE_URL, path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const body = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !body.success) {
    const message = body.success ? 'Request failed' : body.error.message;
    throw new Error(message);
  }

  return body.data;
};
