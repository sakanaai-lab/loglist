import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { password } = body;

  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 });
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json({ error: 'サーバー設定が不足しています' }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
