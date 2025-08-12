```sql
-- Postgres DDL for Bondline core entities
CREATE TABLE users (
  user_id UUID PRIMARY KEY,
  locale TEXT,
  age_gate TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE creators (
  creator_id UUID PRIMARY KEY,
  display_name TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'none',
  payout_account_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE credential_claims (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES creators(creator_id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL,
  jurisdiction TEXT,
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  claim_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
  product_id TEXT PRIMARY KEY,
  product_type TEXT NOT NULL CHECK (product_type IN ('Game','Pack')),
  manifest JSONB NOT NULL,
  consent_profile JSONB,
  credentials_required BOOLEAN DEFAULT false,
  price_cents INTEGER NOT NULL,
  regions TEXT[],
  languages TEXT[],
  status TEXT NOT NULL DEFAULT 'draft',
  creator_id UUID REFERENCES creators(creator_id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE listings (
  product_id TEXT PRIMARY KEY REFERENCES products(product_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  synopsis TEXT,
  audience TEXT[],
  age_rating TEXT,
  evidence_cards JSONB,
  screenshots TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE purchases (
  purchase_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(user_id),
  product_id TEXT REFERENCES products(product_id),
  channel TEXT NOT NULL CHECK (channel IN ('iOS','Android','Web')),
  gross_cents INTEGER NOT NULL,
  taxes_cents INTEGER NOT NULL DEFAULT 0,
  fees_cents INTEGER NOT NULL DEFAULT 0,
  net_cents INTEGER NOT NULL,
  refund_status TEXT NOT NULL DEFAULT 'none',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE payouts (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES creators(creator_id),
  period TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  total_net_receipts_cents INTEGER NOT NULL,
  creator_share_cents INTEGER NOT NULL,
  adjustments_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ratings (
  id UUID PRIMARY KEY,
  product_id TEXT REFERENCES products(product_id),
  user_hash TEXT,
  stars INTEGER CHECK (stars BETWEEN 1 AND 5),
  tags TEXT[],
  comment_private TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE flags (
  id UUID PRIMARY KEY,
  listing_id TEXT REFERENCES listings(product_id),
  reporter_hash TEXT,
  reason_code TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE analytics_events_agg (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT,
  audience TEXT,
  event_name TEXT,
  count BIGINT,
  window_start TIMESTAMPTZ,
  window_end TIMESTAMPTZ
);
```
