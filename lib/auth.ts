import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'loglist_session';

/** セッションの有効期間（秒） */
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30日

/**
 * 署名用の秘密鍵。
 * SESSION_SECRET があればそれを使い、無ければ ADMIN_PASSWORD から導出する。
 * HMACの鍵として使うだけなので、トークンからパスワードは復元できない。
 */
function getSecret(): string | null {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** payload に対する HMAC-SHA256 署名を base64url で返す */
async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

/** 一致するまでの時間で内容を推測されないための定数時間比較 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return timingSafeEqual(password, adminPassword);
}

/**
 * セッショントークンを発行する。
 * 形式: v1.<有効期限(unix秒)>.<HMAC署名>
 * パスワードそのものを含まないため、トークンが漏れても復元できない。
 */
export async function createSessionToken(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `v1.${expiresAt}`;
  return `${payload}.${await sign(payload, secret)}`;
}

/** トークンの署名と有効期限を検証する */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [version, expiresAtStr, signature] = parts;
  if (version !== 'v1') return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt * 1000 <= Date.now()) return false;

  const expected = await sign(`${version}.${expiresAtStr}`, secret);
  return timingSafeEqual(signature, expected);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function isAuthenticatedFromRequest(req: NextRequest): Promise<boolean> {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE_NAME)?.value);
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE };
