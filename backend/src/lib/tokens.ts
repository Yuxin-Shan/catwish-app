import { createHash, randomBytes } from 'node:crypto';
import { SignJWT } from 'jose';
import { env } from './env.js';

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_TOKEN_SECRET);

interface AuthUserTokenPayload {
  id: string;
  email: string;
  displayName: string | null;
}

export const signAccessToken = async (user: AuthUserTokenPayload) => {
  return new SignJWT({
    email: user.email,
    displayName: user.displayName,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuer(env.JWT_ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${env.ACCESS_TOKEN_EXPIRES_IN_SECONDS}s`)
    .sign(accessSecret);
};

export const generateRefreshToken = () => {
  const token = randomBytes(48).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');

  return { token, tokenHash };
};
