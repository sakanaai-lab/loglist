import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkPassword } from '@/lib/auth';

export async function GET() {
  const db = getDb();
  const masks = db.prepare('SELECT * FROM masks ORDER BY position').all();
  return NextResponse.json({ masks });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!checkPassword(body?.password)) {
    return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 });
  }

  const rules: Array<{ from_text: string; to_text: string }> = body.rules ?? [];
  const db = getDb();

  db.transaction(() => {
    db.prepare('DELETE FROM masks').run();
    rules.forEach((rule, i) => {
      db.prepare('INSERT INTO masks (from_text, to_text, position) VALUES (?, ?, ?)').run(
        rule.from_text,
        rule.to_text,
        i
      );
    });
  })();

  const masks = db.prepare('SELECT * FROM masks ORDER BY position').all();
  return NextResponse.json({ masks });
}
