import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM masks ORDER BY position');
  return NextResponse.json({ masks: result.rows });
}

export async function POST(req: NextRequest) {
  // 認証はmiddlewareで処理済み
  const body = await req.json();
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
