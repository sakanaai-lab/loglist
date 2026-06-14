-- loglist セットアップ用SQL
-- Turso の SQL console に貼り付けて Ctrl+Enter で実行してください

CREATE TABLE IF NOT EXISTS posts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT    NOT NULL DEFAULT '',
  model_name  TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id   INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  role      TEXT    NOT NULL CHECK(role IN ('user','ai')),
  content   TEXT    NOT NULL,
  reasoning TEXT    NOT NULL DEFAULT '',
  position  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS masks (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  from_text TEXT    NOT NULL,
  to_text   TEXT    NOT NULL,
  position  INTEGER NOT NULL DEFAULT 0
);

-- ▼ 既存のデータベースを更新する場合
-- CREATE TABLE IF NOT EXISTS は既存テーブルへ列を追加しません。
-- migrations/ 内のSQLを番号順に実行してください。
-- ALTER TABLE posts ADD COLUMN description TEXT NOT NULL DEFAULT '';
