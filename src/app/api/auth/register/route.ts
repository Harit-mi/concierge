import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { signToken } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const passwordHash = bcrypt.hashSync(password, 10);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, phone, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'CUSTOMER', 1, ?, ?)
    `).run(userId, cleanEmail, passwordHash, name.trim(), phone || null, now, now);

    // Create profile
    db.prepare(`
      INSERT INTO customer_profiles (id, user_id, preferred_currency, country_code, created_at, updated_at)
      VALUES (?, ?, 'USD', 'US', ?, ?)
    `).run(`prof-${userId}`, userId, now, now);

    recordAuditLog(userId, 'USER_REGISTERED', 'users', userId, { email: cleanEmail });

    const token = signToken({
      userId,
      email: cleanEmail,
      role: 'CUSTOMER',
      name: name.trim(),
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
        name: name.trim(),
        role: 'CUSTOMER',
      },
    });

    response.cookies.set('concierge_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 86400,
    });

    return response;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Could not complete registration.' }, { status: 500 });
  }
}
