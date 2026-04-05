import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'loglist.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      model_name  TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id  INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      role     TEXT    NOT NULL CHECK(role IN ('user','ai')),
      content  TEXT    NOT NULL,
      position INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS masks (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      from_text TEXT NOT NULL,
      to_text   TEXT NOT NULL,
      position  INTEGER NOT NULL DEFAULT 0
    );
  `);

  return db;
}
