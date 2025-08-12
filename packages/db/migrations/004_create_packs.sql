-- Create Packs table referenced by various services
CREATE TABLE IF NOT EXISTS "Packs" (
  "pack_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "creator_id" UUID NOT NULL REFERENCES "Creators"("creator_id") ON DELETE CASCADE,
  "title" VARCHAR(200) NOT NULL,
  "description" TEXT,
  "status" VARCHAR(50) DEFAULT 'draft',
  "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Basic index to list packs by newest
CREATE INDEX IF NOT EXISTS idx_packs_created_at ON "Packs" (created_at DESC);
