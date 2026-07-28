-- Minimal index of app.holdfast.market.listing records.
-- v0.1: schema only. Firehose ingestion to populate this table is TASKS.md #2.
CREATE TABLE IF NOT EXISTS listings (
  uri TEXT PRIMARY KEY,
  cid TEXT NOT NULL,
  seller_did TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_amount TEXT NOT NULL,
  price_currency TEXT NOT NULL,
  listing_type TEXT NOT NULL,
  condition TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  indexed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_listings_status ON listings (status);
CREATE INDEX IF NOT EXISTS idx_listings_listing_type ON listings (listing_type);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings (category);
