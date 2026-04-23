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
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id  INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  role     TEXT    NOT NULL CHECK(role IN ('user','ai')),
  content  TEXT    NOT NULL,
  position INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS masks (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  from_text TEXT    NOT NULL,
  to_text   TEXT    NOT NULL,
  position  INTEGER NOT NULL DEFAULT 0
);

-- ▼ 既にテーブルが存在する古いバージョンからのマイグレーション用
-- （初回セットアップ時は不要。実行してもエラーにはなりません）
-- ALTER TABLE posts ADD COLUMN description TEXT NOT NULL DEFAULT '';

-- ▼ model_name を任意項目に変更する場合（既存DBの場合）
-- SQLiteではカラムのNOT NULL制約を直接変更できないが、
-- デフォルト値として空文字列が入るので、アプリ側で空文字列を許容する形に変更済み。
-- 新規セットアップの場合は model_name NOT NULL のまま（空文字列が入る）
