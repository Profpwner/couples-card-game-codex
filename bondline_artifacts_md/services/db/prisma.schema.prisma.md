```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  user_id   String  @id @default(uuid())
  locale    String?
  age_gate  String?
  created_at DateTime @default(now())
  purchases Purchase[]
}

model Creator {
  creator_id String @id @default(uuid())
  display_name String
  verification_status String @default("none")
  payout_account_id String?
  created_at DateTime @default(now())
  products Product[]
  credentials CredentialClaim[]
}

model CredentialClaim {
  id String @id @default(uuid())
  creator   Creator @relation(fields: [creator_id], references: [creator_id])
  creator_id String
  credential_type String
  jurisdiction String?
  verified_at DateTime?
  expires_at DateTime?
  claim_hash String
  created_at DateTime @default(now())
}

model Product {
  product_id String @id
  product_type String
  manifest    Json
  consent_profile Json?
  credentials_required Boolean @default(false)
  price_cents Int
  regions     String[]
  languages   String[]
  status      String @default("draft")
  creator   Creator? @relation(fields: [creator_id], references: [creator_id])
  creator_id String?
  listing   Listing?
  purchases Purchase[]
  created_at DateTime @default(now())
}

model Listing {
  product_id String @id
  product   Product @relation(fields: [product_id], references: [product_id])
  title     String
  synopsis  String?
  audience  String[]
  age_rating String?
  evidence_cards Json?
  screenshots String[]
  created_at DateTime @default(now())
}

model Purchase {
  purchase_id String @id @default(uuid())
  user     User? @relation(fields: [user_id], references: [user_id])
  user_id  String?
  product  Product? @relation(fields: [product_id], references: [product_id])
  product_id String?
  channel  String
  gross_cents Int
  taxes_cents Int @default(0)
  fees_cents Int @default(0)
  net_cents Int
  refund_status String @default("none")
  created_at DateTime @default(now())
}

model Payout {
  id String @id @default(uuid())
  creator Creator @relation(fields: [creator_id], references: [creator_id])
  creator_id String
  period String
  currency String @default("USD")
  total_net_receipts_cents Int
  creator_share_cents Int
  adjustments_cents Int @default(0)
  created_at DateTime @default(now())
}

model Rating {
  id String @id @default(uuid())
  product  Product? @relation(fields: [product_id], references: [product_id])
  product_id String?
  user_hash String?
  stars Int
  tags String[]
  comment_private String?
  created_at DateTime @default(now())
}

model Flag {
  id String @id @default(uuid())
  listing Listing? @relation(fields: [listing_id], references: [product_id])
  listing_id String?
  reporter_hash String?
  reason_code String?
  note String?
  created_at DateTime @default(now())
}
```
