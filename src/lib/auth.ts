import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from './db';
import { getConfig } from './config';
import { User, UserRole } from '@/types';

const COOKIE_NAME = 'concierge_session';

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export function signToken(payload: SessionPayload): string {
  const secret = getConfig().jwtSecret;
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const secret = getConfig().jwtSecret;
    return jwt.verify(token, secret) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<User | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const user = db.prepare('SELECT id, email, name, phone, role, is_active as isActive, created_at as createdAt FROM users WHERE id = ? AND is_active = 1').get(payload.userId) as User | undefined;
    return user || null;
  } catch (err) {
    console.error('Error fetching session user:', err);
    return null;
  }
}

export async function requireAuth(allowedRoles?: UserRole[]): Promise<User> {
  const user = await getSession();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}
