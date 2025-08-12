-- Add tables for user reviews and follows

-- Reviews table
CREATE TABLE IF NOT EXISTS "Reviews" (
    "review_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "Users"("user_id"),
    "pack_id" UUID NOT NULL REFERENCES "Packs"("pack_id"),
    "rating" INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    "review_text" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Follows table (user following creator)
CREATE TABLE IF NOT EXISTS "Follows" (
    "user_id" UUID NOT NULL REFERENCES "Users"("user_id") ON DELETE CASCADE,
    "creator_id" UUID NOT NULL REFERENCES "Creators"("creator_id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY ("user_id", "creator_id")
);