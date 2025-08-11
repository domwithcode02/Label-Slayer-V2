-- 0002_idempotency.sql
-- Add idempotency_keys table for POST request deduplication window (10–15 minutes at app layer)

-- up
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  method TEXT NOT NULL,
  route TEXT NOT NULL,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  response_status INTEGER,
  response_body TEXT
);

CREATE INDEX IF NOT EXISTS idx_idem_last_seen ON idempotency_keys(last_seen_at);

INSERT OR IGNORE INTO schema_migrations (version, applied_at) VALUES ('0002', datetime('now'));

-- down
DROP INDEX IF EXISTS idx_idem_last_seen;
DROP TABLE IF EXISTS idempotency_keys;

DELETE FROM schema_migrations WHERE version = '0002';