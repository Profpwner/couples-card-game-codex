-- Create Cards table for normalized card storage
CREATE TABLE IF NOT EXISTS "Cards" (
  "card_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "pack_id" UUID NOT NULL REFERENCES "Packs"("pack_id") ON DELETE CASCADE,
  "position" INTEGER NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cards_pack_id ON "Cards"("pack_id");
CREATE UNIQUE INDEX IF NOT EXISTS idx_cards_pack_position ON "Cards"("pack_id", "position");

