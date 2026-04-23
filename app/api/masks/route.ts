import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkPassword } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get('password');
  if (!checkPassword(password ?? undefined)) {
    return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 });
  }
  const db = getDb();
  const result = await db.execute('SELECT * FROM masks ORDER BY position');
  return NextResponse.json({ masks: result.rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!checkPassword(body?.password)) {
    return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 });
  }

  const rules: Array<{ from_text: string; to_text: string }> = body.rules ?? [];
  const db = getDb();

  await db.execute('DELETE FROM masks');
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    await db.execute({ sql: 'INSERT INTO masks (from_text, to_text, position) VALUES (?, ?, ?)', args: [rule.from_text, rule.to_text, i] });
  }

  const result = await db.execute('SELECT * FROM masks ORDER BY position');
  return NextResponse.json({ masks: result.rows });
}
