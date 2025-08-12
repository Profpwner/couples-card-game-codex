# How to Start the Application

This guide covers how to start all services in your local development environment.

## Prerequisites
- Node.js >= 18
- pnpm (recommended) — workspace-aware and fast
- PostgreSQL running locally on default port

## 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd <repo-root>
pnpm install
```

## 2. Configure Environment Variables (Single Root .env)
Use one .env file at the repo root for all services and apps.
```bash
cp .env.example .env
```
Then edit .env to set values for:
- DATABASE_URL (PostgreSQL connection string)
  - Example: `postgres://postgres:postgres@localhost:5432/project_connect`
  - Ensure the database exists: `createdb project_connect` (or create via your client)
- JWT_SECRET (used to sign tokens)
  - Example: a long random string: `openssl rand -hex 32`
  - Keep this secret; do not commit it.
- OPENAI_API_KEY (for LLM integration)
  - Obtain from OpenAI; set to a valid key or omit when running tests that mock LLM calls.
- NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_AUTH_BASE_URL (Web)
  - Defaults provided for local dev.
- API_BASE_URL (Mobile)
  - Defaults to `http://localhost:5000`

### OAuth/MFA Configuration (for full implementation)
- Auth Service (.env)
  - OAUTH_TEST_MODE: set to `false` in production; `true` or `NODE_ENV=test` enables stubbed responses for tests.
  - Google OAuth:
    - GOOGLE_CLIENT_ID
    - GOOGLE_CLIENT_SECRET
    - GOOGLE_REDIRECT_URI (e.g., `http://localhost:4000/api/auth/oauth/google/callback`)
  - Apple Sign-In:
    - APPLE_CLIENT_ID
    - APPLE_TEAM_ID
    - APPLE_KEY_ID
    - APPLE_PRIVATE_KEY_BASE64 (base64-encoded PKCS8 private key)
  - MFA (TOTP):
    - MFA_ISSUER (e.g., `ProjectConnect`) used by authenticator apps
- Web App (.env.local)
  - NEXT_PUBLIC_GOOGLE_CLIENT_ID (frontend OAuth button)
  - NEXT_PUBLIC_APPLE_CLIENT_ID (frontend OAuth button)

## 3. Run Database Migrations
```bash
npm run db:migrate
```
This will create the required tables for all services.

### (Optional) Seed Sample Data
```bash
npm run db:seed
```
This seeds a demo creator user (`seed.creator@example.com`) and a couple of sample packs for marketplace testing.
It also seeds a default consumer user (`seed.consumer@example.com`) and sample reviews on the latest pack so the mobile reviews UI shows data immediately.

Full DB setup sequence (recommended):
```bash
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/project_connect
npm run db:migrate
npm run db:seed
```

## 4. Start Services

### Auth Service (Port 4000)
```bash
pnpm --filter auth-service dev
```

### Creator Service (Port 5000)
```bash
pnpm --filter creator-service dev
```

### LLM Service
```bash
cd packages/llm-service
npm run dev
```

### Web App (Port 3000)
```bash
pnpm --filter web-app dev
```

Now open http://localhost:3000 in your browser to access the web application.

Storybook (component preview):
```bash
pnpm --filter web-app storybook
```

Build Storybook static bundle (outputs to `apps/web/storybook-static`):
```bash
pnpm --filter web-app build-storybook
```

### Mobile App (Expo)
```bash
pnpm --filter mobile-app start     # starts Expo
# optionally
pnpm --filter mobile-app ios       # run on iOS simulator
pnpm --filter mobile-app android   # run on Android emulator/device
```

Notes
- Public marketplace endpoints live on the Creator Service root (e.g., GET http://localhost:5000/packs and GET http://localhost:5000/packs/:id). Ensure your `NEXT_PUBLIC_API_BASE_URL` and mobile `API_BASE_URL` point to the Creator Service base URL without a trailing /api.
- To see marketplace data, you need at least one row in the `Packs` table. You can insert a quick sample via SQL:
  - Ensure you have a User and a corresponding Creator row, then:
    ```sql
    INSERT INTO "Packs" (creator_id, title, description) VALUES ('<an-existing-creator-uuid>', 'Sample Pack', 'Demo pack');
    ```
  - Alternatively, build endpoints/UI for pack creation in the Creator Suite.

## New: Creator Analytics (stub)
- Creator Service now exposes under `/creator`:
  - `GET /creator/analytics/sales` → `{ packsSold, revenueCents }`
  - `GET /creator/analytics/engagement` → `{ readers, avgSessionSec }`
- Web page: navigate to `/analytics` in the web app (requires auth) to view these metrics.

## New: Improved Onboarding UX (Web)
- Visit `/onboard` to become a creator. The page:
  - Checks current status and redirects to `/dashboard` if already a creator.
  - Redirects to `/dashboard` after successful onboarding submission.
