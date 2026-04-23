import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { password } = body;

  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 });
  }

  const token = generateToken(password);
  const response = NextResponse.json({ ok: true });

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
