# Repository Guidelines

## Package Manager
- Recommended: pnpm for monorepos (fast, disk-efficient).
- Use one tool consistently across the repo (pnpm/yarn/npm).
- Generate and commit a single root lockfile:
  - pnpm: `pnpm install` → creates `pnpm-lock.yaml`.
  - yarn: `yarn install` → creates `yarn.lock`.
  - npm: `npm install` → creates `package-lock.json`.
- If switching, remove the old lockfile first and reinstall at root.

## pnpm Workspace Tips
- Filter by package: `pnpm --filter web-app dev`; by group: `pnpm --filter 'apps/*' test`.
- Root scope: use `-w` for root scripts (e.g., `pnpm -w build`) or `-r` to run across all.
- Build only services: `pnpm --filter 'packages/*' build`.
- Example `pnpm-workspace.yaml`:
  ```yaml
  packages:
    - apps/*
    - packages/*
  ```

## Project Structure & Module Organization
- Root workspace uses Turborepo (`turbo.json`) with Yarn/NPM workspaces.
- Apps: `apps/web` (Next.js) and `apps/mobile` (Expo React Native).
- Services: `packages/auth-service`, `packages/creator-service`, `packages/llm-service` (TypeScript/Express).
- Database: `packages/db/{migrations,seeds}` with raw SQL.
- Config: `.eslintrc.js`, `.prettierrc`, `tsconfig.base.json`; examples in `.env.example` files.
- Tests live in `__tests__` and alongside code as `*.test.ts`/`*.test.tsx`.

## Build, Test, and Development Commands
- Install deps at root: `npm i` | `yarn install` | `pnpm i` (then commit the generated lockfile).
- Root build: `npm run build` | `yarn build` | `pnpm -w run build` — runs Turbo across packages.
- Root test: `npm test` | `yarn test` | `pnpm -w test`.
- Lint/format: `npm run lint` | `yarn lint` | `pnpm -w lint`; `npm run format` | `yarn format` | `pnpm -w format`.
- Web app dev: `npm run dev -w apps/web` | `yarn workspace web-app dev` | `pnpm --filter web-app dev`.
- Mobile app dev: `npm start -w apps/mobile` | `yarn workspace mobile-app start` | `pnpm --filter mobile-app start`.
- Services dev: auth `npm run dev -w packages/auth-service` | `yarn workspace auth-service dev` | `pnpm --filter auth-service dev` (same for creator/llm). Build/start similarly.
- DB: `npm run db:migrate` | `yarn db:migrate` | `pnpm -w db:migrate`; same for `db:seed` (requires `DATABASE_URL`).

## Coding Style & Naming Conventions
- TypeScript with 2-space indentation; Prettier formats code; ESLint enforces rules.
- React components: `PascalCase` (e.g., `CardList.tsx`); hooks/utilities: `camelCase`.
- Folders/files: prefer `kebab-case` for directories, `camelCase.ts` for non-components.
- Keep modules small; colocate tests and stories. Storybook available in `apps/web` (`npm run storybook -w apps/web`).

## Testing Guidelines
- Jest across repo; `@testing-library/react` (web), `@testing-library/react-native` (mobile); Cypress in web (`cypress:open`, `cypress:run`).
- Place tests in `__tests__` or `*.test.ts(x)` next to source.
- Cover components, hooks, and service endpoints. No hard coverage gate; test critical paths.

## Commit & Pull Request Guidelines
- Commits: use Conventional Commits (e.g., `feat(web): add deck builder`, `fix(auth): hash password correctly`). Keep messages imperative and scoped.
- PRs: include summary, linked issue, screenshots for UI, and test notes. Ensure lint/tests pass and `.env.example` changes are documented.

## Security & Configuration
- Copy `.env.example` to `.env` per package; set `DATABASE_URL` and any API keys (e.g., `OPENAI_API_KEY` for `llm-service`). Never commit secrets.
