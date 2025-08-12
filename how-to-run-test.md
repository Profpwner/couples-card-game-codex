# How to Run Tests

This repo is a pnpm/Turbo monorepo. You can run all tests from the root, or target a specific workspace.

## Prerequisites
- Node.js >= 18 (Node 18 LTS recommended for React Native tests)
- pnpm installed (`npm i -g pnpm`)

## Install dependencies
```bash
pnpm install
```

## Run all tests (root)
```bash
pnpm -w test
```
This invokes Turbo to run each package’s `test` script.

## Run tests by workspace
```bash
# Web (Next.js)
pnpm --filter web-app test

# Mobile (Expo RN)
pnpm --filter mobile-app test
# Or enforce Node >= 18 for mobile tests
pnpm run test:mobile18

# Creator service (Express)
pnpm --filter creator-service test

# Auth service (Express)
pnpm --filter auth-service test

# LLM service (library)
pnpm --filter llm-service test
```

## Tips
- Watch mode: `pnpm --filter web-app test -- --watch`
- Single file: `pnpm --filter web-app test -- apps/web/__tests__/onboard.test.tsx`
- By name: `pnpm --filter creator-service test -- -t packs`
- Turbo filters: `pnpm exec turbo run test --filter 'web-app' --filter 'creator-service'`

## Lint & format
```bash
pnpm -w run lint
pnpm -w run format -- --check
```

## Storybook (components)
```bash
pnpm --filter web-app storybook
```

## E2E (web)
```bash
cd apps/web
npm run cypress:open     # interactive
npm run cypress:run      # headless
```

## Environment notes
- Tests are designed to run without a live database. Migrations are only required for local app runs.
- For web tests that rely on API proxies, axios requests are mocked in tests.
