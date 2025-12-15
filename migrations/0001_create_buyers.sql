CREATE TABLE IF NOT EXISTS buyers (
  id TEXT PRIMARY KEY,
  buyer_name TEXT NOT NULL,
  bags_of_ten INTEGER NOT NULL DEFAULT 0,
  bags_of_twenty INTEGER NOT NULL DEFAULT 0,
  oranges_picked INTEGER NOT NULL DEFAULT 0,
  oranges_paid INTEGER NOT NULL DEFAULT 0,
  created_at_iso TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_buyers_name ON buyers(buyer_name);