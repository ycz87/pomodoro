-- 西瓜时钟 D1 数据库 Schema
-- Version: 0.10.0

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  auth_provider TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS focus_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  task_name TEXT,
  duration_minutes INTEGER,
  status TEXT,
  started_at TEXT,
  ended_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_type TEXT,
  count INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, item_type)
);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY,
  settings_json TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS synthesis_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  input_type TEXT,
  input_count INTEGER,
  output_type TEXT,
  output_count INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_focus_records_user_id ON focus_records(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_records_started_at ON focus_records(user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_synthesis_log_user_id ON synthesis_log(user_id);

-- v0.15.0: Admin support
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';
ALTER TABLE users ADD COLUMN last_active_at TEXT;

-- v0.19.3: Achievements sync
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id TEXT PRIMARY KEY,
  achievements_json TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
