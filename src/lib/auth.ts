import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from './db';
import { User, UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'concierge_luxury_jwt_secure_secret_key_2026_x';
const COOKIE_NAME = 'concierge_session';

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
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
