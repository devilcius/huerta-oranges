CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  created_at_iso TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at_iso DESC);
