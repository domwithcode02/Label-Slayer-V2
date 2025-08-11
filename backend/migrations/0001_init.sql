-- 0001_init.sql
-- SQLite DDL for LabelSlayer scaffold. Reversible by dropping created objects.
-- up

CREATE TABLE IF NOT EXISTS schema_migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version TEXT NOT NULL UNIQUE,
  applied_at TEXT NOT NULL
);

INSERT OR IGNORE INTO schema_migrations (version, applied_at) VALUES ('0001', datetime('now'));

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  upc TEXT,
  image_key TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_upc ON products(upc);

CREATE TABLE IF NOT EXISTS image_signatures (
  phash TEXT PRIMARY KEY,
  first_seen_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS analysis_records (
  analysis_id TEXT PRIMARY KEY,
  product_id TEXT,
  phash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued','processing','succeeded','failed')),
  summary TEXT,
  etag TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (phash) REFERENCES image_signatures(phash)
);

CREATE INDEX IF NOT EXISTS idx_analysis_by_phash ON analysis_records(phash, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_by_product ON analysis_records(product_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_status ON analysis_records(status);

-- Idempotency keys (soft dedupe for POST requests, 10–15 min window suggested at application layer)
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

CREATE TABLE IF NOT EXISTS user_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  type TEXT NOT NULL,
  product_id TEXT,
  analysis_id TEXT,
  metadata_json TEXT,
  occurred_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (analysis_id) REFERENCES analysis_records(analysis_id)
);

CREATE INDEX IF NOT EXISTS idx_user_history_user ON user_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_history_type ON user_history(type);
CREATE INDEX IF NOT EXISTS idx_user_history_occurred ON user_history(occurred_at);

CREATE TABLE IF NOT EXISTS telemetry_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  payload_json TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_telemetry_type ON telemetry_events(event_type);
CREATE INDEX IF NOT EXISTS idx_telemetry_created ON telemetry_events(created_at);

-- View for latest analysis per pHash
DROP VIEW IF EXISTS v_latest_analysis_by_phash;
CREATE VIEW v_latest_analysis_by_phash AS
SELECT
  ar.analysis_id,
  ar.product_id,
  ar.phash,
  ar.status,
  ar.summary,
  ar.etag,
  ar.updated_at,
  p.name AS product_name,
  p.brand AS product_brand,
  p.upc AS product_upc,
  p.image_key AS image_key
FROM analysis_records ar
LEFT JOIN products p ON p.id = ar.product_id
WHERE ar.updated_at = (
  SELECT MAX(ar2.updated_at) FROM analysis_records ar2 WHERE ar2.phash = ar.phash
);

-- down
-- Drop created objects in reverse order
DROP VIEW IF EXISTS v_latest_analysis_by_phash;
DROP TABLE IF EXISTS telemetry_events;
DROP INDEX IF EXISTS idx_telemetry_created;
DROP INDEX IF EXISTS idx_telemetry_type;

DROP INDEX IF EXISTS idx_user_history_occurred;
DROP INDEX IF EXISTS idx_user_history_type;
DROP INDEX IF EXISTS idx_user_history_user;
DROP TABLE IF EXISTS user_history;

DROP INDEX IF EXISTS idx_analysis_status;
DROP INDEX IF EXISTS idx_analysis_by_product;
DROP INDEX IF EXISTS idx_analysis_by_phash;
DROP TABLE IF EXISTS analysis_records;

DROP TABLE IF EXISTS image_signatures;

DROP INDEX IF EXISTS idx_products_upc;
DROP INDEX IF EXISTS idx_products_brand;
DROP INDEX IF EXISTS idx_products_name;
DROP TABLE IF EXISTS products;

DELETE FROM schema_migrations WHERE version = '0001';