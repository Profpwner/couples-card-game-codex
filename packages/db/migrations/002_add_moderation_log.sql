-- Add table for tracking moderation actions
CREATE TABLE IF NOT EXISTS "ModerationLog" (
    "log_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "content_id" UUID NOT NULL,
    "content_type" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50),
    "moderator_id" UUID,
    "action_taken" VARCHAR(50),
    "notes" TEXT,
    "timestamp" TIMESTAMPTZ DEFAULT NOW()
);