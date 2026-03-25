import { apiFetch } from './client';
import { AuthSession } from '../auth/session';

type RegisterInput = {
  email: string;
  password: string;
  displayName: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const registerWithBackend = async (input: RegisterInput) =>
  apiFetch<AuthSession>('/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });

export const loginWithBackend = async (input: LoginInput) =>
  apiFetch<AuthSession>('/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });

export const refreshBackendSession = async (refreshToken: string) =>
  apiFetch<AuthSession>('/v1/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

export const logoutWithBackend = async (refreshToken: string) =>
  apiFetch<{ revoked: true }>('/v1/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

export const logoutAllWithBackend = async (userId: string) =>
  apiFetch<{ revoked: true; count: number }>('/v1/auth/logout-all', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
