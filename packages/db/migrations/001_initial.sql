-- Initial schema for Users and Creators tables
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "Users" (
    "user_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "is_creator" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Creators" (
    "creator_id" UUID PRIMARY KEY REFERENCES "Users"("user_id") ON DELETE CASCADE,
    "display_name" VARCHAR(100) NOT NULL,
    "bio" TEXT,
    "payout_details_token" VARCHAR(255),
    "tier_level" VARCHAR(50) DEFAULT 'Bronze'
);

-- Table for storing valid refresh tokens
CREATE TABLE IF NOT EXISTS "RefreshTokens" (
    "token" TEXT PRIMARY KEY,
    "user_id" UUID NOT NULL REFERENCES "Users"("user_id") ON DELETE CASCADE,
    "expires_at" TIMESTAMPTZ NOT NULL
);