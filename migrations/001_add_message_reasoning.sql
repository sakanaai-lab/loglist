-- 推論欄を追加する前のバージョンから更新する場合に、一度だけ実行してください。
-- Turso の SQL console に貼り付けて Run（Ctrl+Enter）を押します。

ALTER TABLE messages ADD COLUMN reasoning TEXT NOT NULL DEFAULT '';
