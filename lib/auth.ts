import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'loglist_session';
// シンプルにHMAC的なトークンをパスワードから生成
function generateToken(password: string): string {
  // パスワード+固定saltのBase64をトークンとして使う
  return Buffer.from(`loglist_auth:${password}:verified`).toString('base64');
}

export function getExpectedToken(): string | null {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return null;
  return generateToken(adminPassword);
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return password === adminPassword;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  const expected = getExpectedToken();
  return token === expected;
}

export function isAuthenticatedFromRequest(req: NextRequest): boolean {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  const expected = getExpectedToken();
  return token === expected;
}

export { SESSION_COOKIE_NAME, generateToken };
