-- Seed sample data: one creator user and two packs
DO $$
DECLARE
  uid UUID;
BEGIN
  -- Ensure a user exists and is a creator
  SELECT "user_id" INTO uid FROM "Users" WHERE email = 'seed.creator@example.com';
  IF uid IS NULL THEN
    INSERT INTO "Users" (email, password_hash, is_creator)
    VALUES ('seed.creator@example.com', '$argon2id$v=19$m=65536,t=3,p=2$dummy$dummy', TRUE)
    RETURNING "user_id" INTO uid;
  ELSE
    UPDATE "Users" SET is_creator = TRUE WHERE user_id = uid;
  END IF;

  -- Ensure a corresponding creator row exists
  INSERT INTO "Creators" (creator_id, display_name, bio, payout_details_token)
  VALUES (uid, 'Seed Creator', 'Demo creator for local development', 'tok_seed')
  ON CONFLICT (creator_id) DO UPDATE
  SET display_name = EXCLUDED.display_name,
      bio = EXCLUDED.bio;

  -- Insert sample packs if they don't already exist for this creator
  IF NOT EXISTS (SELECT 1 FROM "Packs" WHERE creator_id = uid AND title = 'Sample Pack 1') THEN
    INSERT INTO "Packs" (creator_id, title, description, status)
    VALUES (uid, 'Sample Pack 1', 'Demo pack 1', 'draft');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM "Packs" WHERE creator_id = uid AND title = 'Sample Pack 2') THEN
    INSERT INTO "Packs" (creator_id, title, description, status)
    VALUES (uid, 'Sample Pack 2', 'Demo pack 2', 'draft');
  END IF;
END $$;
