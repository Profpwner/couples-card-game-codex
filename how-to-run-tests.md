# How to Run Tests

## Install Dependencies
- Use one package manager consistently — this repo uses pnpm.
- Install: `pnpm install`

## Run All Tests (Root)
- Preferred (Turbo): `pnpm -w test` (runs `turbo run test` across workspaces)

## Workspace-Specific Tests
- Web: `pnpm --filter web-app test`
- Web (specific new tests):
  - Analytics page test: `pnpm --filter web-app test -- apps/web/__tests__/analytics.test.tsx`
  - Onboarding page tests: `pnpm --filter web-app test -- apps/web/__tests__/onboard.test.tsx`
- Auth Service: `pnpm --filter auth-service test`
- Creator Service (includes analytics endpoints): `pnpm --filter creator-service test`
- LLM Service: `pnpm --filter llm-service test`
- Mobile App (see Node note below): `pnpm --filter mobile-app test`

Other workspaces (replace filter/workspace): `packages/auth-service`, `packages/creator-service`, `apps/mobile`.

## Useful Commands & Patterns
- Watch mode: append `-- --watch` (npm), `--watch` (yarn), or `pnpm --filter web-app test -- --watch`.
- Run a single test file: `npm test -- apps/web/__tests__/marketplace-proxy.test.ts`.
- By name pattern: `npm test -- -t "marketplace proxy"` (works with yarn/pnpm too).
- Web tests use jsdom by default (see `apps/web/jest.config.js`).
- Run via Turbo with filters: `pnpm exec turbo run test --filter 'web-app' --filter 'creator-service' --summarize`.

## Next.js API Proxy Tests (Web)
- Marketplace proxy: `npm test --workspace=apps/web -- apps/web/__tests__/marketplace-proxy.test.ts`
- PackBuilder submit (proxy): `npm test --workspace=apps/web -- apps/web/__tests__/packbuilder-submit.test.tsx`

## Lint & Format Checks
- Lint: `npm run lint` | `yarn lint` | `pnpm -w lint`
- Format check: `npm run format -- --check` | `yarn format --check` | `pnpm -w format -- --check`

## Storybook (Component Preview)
- `pnpm --filter web-app storybook`

## Cypress E2E Tests (Web)

## Mobile App Tests (Node version)
- React Native + Jest/Expo tests are most stable on Node 18 LTS.
- We provide a helper script to run mobile tests and guard the Node version:
  - `pnpm run test:mobile18`
  - Prints a clear message if Node is not at least v18.
  - To force-run under CI on Node 22+, consider excluding mobile from Turbo: `pnpm exec turbo run test --filter '!mobile-app'` and run mobile tests in a separate job using Node 18.

## New: Creator Analytics tests
- Creator Service analytics endpoints are covered by unit tests:
  - Run: `pnpm --filter creator-service test`
- Interactive: `cd apps/web && npm run cypress:open`
- Headless: `cd apps/web && npm run cypress:run`
