-- Seed a default consumer user and sample reviews for existing packs
DO $$
DECLARE
  consumer_id UUID;
  sample_pack_id UUID;
BEGIN
  -- Ensure a consumer (non-creator) user exists
  SELECT "user_id" INTO consumer_id FROM "Users" WHERE email = 'seed.consumer@example.com';
  IF consumer_id IS NULL THEN
    INSERT INTO "Users" (email, password_hash, is_creator)
    VALUES ('seed.consumer@example.com', '$argon2id$v=19$m=65536,t=3,p=2$dummy$dummy', FALSE)
    RETURNING "user_id" INTO consumer_id;
  END IF;

  -- Pick one sample pack to attach reviews to
  SELECT p."pack_id" INTO sample_pack_id
  FROM "Packs" p
  ORDER BY p."created_at" DESC
  LIMIT 1;

  IF sample_pack_id IS NOT NULL THEN
    -- Insert sample reviews if none exist for this consumer+pack yet
    IF NOT EXISTS (
      SELECT 1 FROM "Reviews" r
      WHERE r."user_id" = consumer_id AND r."pack_id" = sample_pack_id
    ) THEN
      INSERT INTO "Reviews" (user_id, pack_id, rating, review_text)
      VALUES
        (consumer_id, sample_pack_id, 5, 'Amazing pack! Highly recommend.'),
        (consumer_id, sample_pack_id, 4, 'Really good content and structure.');
    END IF;
  END IF;
END $$;
