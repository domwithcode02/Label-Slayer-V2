-- Add structured analysis data column
ALTER TABLE analysis_records ADD COLUMN analysis_data_json TEXT;

-- Add product creation from analysis flag
ALTER TABLE products ADD COLUMN analysis_generated BOOLEAN DEFAULT FALSE;

-- Update schema version
UPDATE schema_migrations SET version = '0003', applied_at = datetime('now') WHERE version = '0002';
INSERT OR IGNORE INTO schema_migrations (version, applied_at) VALUES ('0003', datetime('now'));