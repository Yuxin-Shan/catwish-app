import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString('hex');

  return `${salt}:${derivedKey}`;
};

export const verifyPassword = (password: string, storedHash: string) => {
  const [salt, originalHash] = storedHash.split(':');

  if (!salt || !originalHash) {
    return false;
  }

  const originalBuffer = Buffer.from(originalHash, 'hex');
  const derivedBuffer = scryptSync(password, salt, KEY_LENGTH);

  if (originalBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(originalBuffer, derivedBuffer);
};
