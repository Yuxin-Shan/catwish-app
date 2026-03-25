import { env } from './env.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const priorities: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const shouldLog = (level: LogLevel) => priorities[level] >= priorities[env.LOG_LEVEL];

const emit = (level: LogLevel, message: string, meta?: Record<string, unknown>) => {
  if (!shouldLog(level)) {
    return;
  }

  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  console.log(JSON.stringify(entry));
};

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => emit('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => emit('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => emit('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => emit('error', message, meta),
};
