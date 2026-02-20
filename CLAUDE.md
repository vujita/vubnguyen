# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Repository Overview

This is a personal portfolio monorepo for [vubnguyen.com](https://vubnguyen.com) — the personal site of Vu Nguyen, a Staff Engineer at Amplitude. The repo is inspired by the [T3 stack](https://create.t3.gg/) and uses Turborepo for monorepo orchestration.

## Monorepo Structure

```
.
├── apps/
│   └── vubnguyen/          # Main Next.js portfolio site
├── packages/
│   ├── api/                # tRPC router definitions
│   ├── auth/               # NextAuth.js configuration
│   ├── config/
│   │   └── eslint/         # Shared ESLint config (eslint-config-vujita)
│   ├── db/                 # Drizzle ORM schema & DB client
│   └── vujita-ui/          # Published React/Tailwind component library
├── turbo.json              # Turborepo task pipeline
├── pnpm-workspace.yaml     # pnpm workspace + version catalog
├── lerna.json              # Version management
└── prettier.config.mjs     # Shared Prettier config
```

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| API | tRPC v11 |
| Database ORM | Drizzle ORM (PostgreSQL) |
| Auth | NextAuth.js v4 (Discord OAuth) |
| State/Fetching | TanStack Query v5 |
| UI Library | vujita-ui (internal, also published to npm) |
| Monorepo | Turborepo + pnpm workspaces |
| Package Manager | pnpm 10 |
| Node Version | ≥ 18.16 (see `.nvmrc`) |
| Unit Tests | Jest + jsdom (vujita-ui only) |
| E2E Tests | Playwright (Chromium, Firefox, WebKit) |
| Storybook | Storybook 8 (for vujita-ui) |

## Package Descriptions

### `apps/vubnguyen`
The main Next.js portfolio site. Uses the App Router with:
- Server components by default
- `src/app/` — page routes (home, work, writing, contact)
- `src/app/writing/` — individual blog post pages (statically defined in `src/lib/posts.ts`)
- `src/components/` — shared UI components (Header, PostLayout, auth, signature, theme-switcher)
- `src/utils/api.ts` — tRPC client setup
- `src/env.mjs` — typed environment variables via `@t3-oss/env-nextjs`
- E2E tests in `e2e/` using Playwright

Blog posts are statically defined in `src/lib/posts.ts` as an array of `PostMeta` objects. Each post slug maps to a folder under `src/app/writing/`.

### `packages/api`
tRPC router. Entry point is `index.ts`. The app router is in `src/root.ts`. Add new routers in `src/router/` and register them in `src/root.ts`. Currently has one router: `auth`.

### `packages/auth`
NextAuth.js configuration using the Drizzle adapter. Exports the auth handler and session utilities. Only for use in Next.js contexts.

### `packages/db`
Drizzle ORM. Schema is in `src/schema.ts`. The `db` client and schema are exported from `src/index.ts`. Migrations live in the `drizzle/` directory.

- Run `pnpm db:push` to sync schema to the database (development).
- Run `pnpm db:generate` to generate migration files.
- Run `pnpm db:migrate` to apply migrations.
- Run `pnpm db:studio` to open Drizzle Studio on port 5556.

**Schema tables:** `user`, `account`, `session`, `verification_token`, `VerificationToken`

### `packages/config/eslint`
Shared ESLint configuration exported as `eslint-config-vujita`. Referenced by all packages.

### `packages/vujita-ui`
Publishable React/Tailwind component library (npm: `vujita-ui`). Built with `tsdown` to both ESM and CJS. Components: `Avatar`, `Skeleton`, `Classnames` utility, and others.

- Unit tests use Jest with `jsdom`.
- Storybook is used for visual development.
- Build artifacts go to `dist/`.

## Development Workflows

### Initial Setup

```bash
nvm install && nvm use        # Use correct Node version
corepack enable
corepack prepare pnpm@8.6.9 --activate
cp .env.example .env          # Fill in secrets
pnpm install
pnpm db:push                  # Sync DB schema
```

### Common Commands

```bash
# Development
pnpm dev                      # Run all apps in parallel
pnpm dev:vubnguyen            # Run only the portfolio app + vujita-ui

# Building
pnpm build                    # Build all packages
pnpm build:vubnguyen          # Build only the portfolio app

# Linting & Formatting
pnpm lint                     # ESLint across all packages
pnpm lint:fix                 # ESLint with auto-fix
pnpm format                   # Prettier format all files
pnpm check                    # Prettier check (no write)

# Type Checking
pnpm type-check               # TypeScript check across all packages

# Testing
pnpm test                     # Unit tests (Jest)
pnpm test:e2e                 # Playwright E2E tests
pnpm test:all                 # type-check + build + lint + test + e2e

# Database
pnpm db:push                  # Sync schema to DB (dev only)
pnpm db:generate              # Generate migration files
pnpm db:migrate               # Run migrations
pnpm db:studio                # Open Drizzle Studio (port 5556)

# Workspace management
pnpm manypkg:check            # Validate workspace dependency consistency
pnpm manypkg:fix              # Auto-fix workspace issues
```

### Running a Single Package

Use `pnpm -F <package-name> <script>` to scope to a workspace:

```bash
pnpm -F @vujita/vubnguyen dev
pnpm -F vujita-ui test
pnpm -F @vujita/db db:migrate
```

Or use Turbo's `--filter`:

```bash
pnpm turbo dev --filter @vujita/vubnguyen
```

## Environment Variables

Copy `.env.example` to `.env` at the repo root. All apps load the root `.env` via `dotenv-cli`.

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | Public URL of the app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | NextAuth secret (generate with `openssl rand -base64 32`) |
| `DISCORD_CLIENT_ID` | Discord OAuth app client ID |
| `DISCORD_CLIENT_SECRET` | Discord OAuth app client secret |
| `CHROMATIC_PROJECT_TOKEN` | For publishing Storybook to Chromatic |

## Code Conventions

### TypeScript
- Strict mode is enabled across all packages.
- No relative import paths between packages (enforced by ESLint `no-relative-import-paths`).
- Use workspace imports: `import { ... } from "@vujita/db"` (not `../../packages/db`).
- Types are colocated with the code they describe; avoid separate `types/` directories.

### Imports (Prettier enforced order)
1. `react` / `react-*`
2. `next` / `next-*`
3. `expo` / `expo-*`
4. Third-party modules
5. `@vujita/*` workspace packages
6. `~/utils/*`
7. `~/components/*`
8. `~/styles/*`
9. `~/`
10. Relative (`./`, `../`)

### Styling
- Tailwind CSS utility classes only (no custom CSS except `globals.css`).
- Use CSS custom properties (e.g. `var(--site-bg)`) for theming instead of Tailwind theme extension.
- Tailwind class order is enforced by `prettier-plugin-tailwindcss`.

### Adding Blog Posts
1. Add a new entry to the `allPosts` array in `apps/vubnguyen/src/lib/posts.ts`.
2. Create a new folder: `apps/vubnguyen/src/app/writing/<slug>/page.tsx`.
3. Use the `PostLayout` component for consistent post layout.

### Adding tRPC Routes
1. Create a new file in `packages/api/src/router/`.
2. Define the router using `createTRPCRouter` with `publicProcedure` or `protectedProcedure`.
3. Import and register it in `packages/api/src/root.ts`.

### Adding UI Components (vujita-ui)
1. Create the component in `packages/vujita-ui/src/`.
2. Export it from `packages/vujita-ui/src/index.tsx`.
3. Add a Storybook story if needed.
4. Add the export entry to `tsdown.config.ts` if it should be a separate entry point.

## Pre-commit Hooks

Husky runs the following on every commit:
1. `manypkg fix` — auto-fix workspace dependency issues
2. `lint-staged` — run Prettier (and ESLint for source files) on staged files
3. `pnpm check` — full Prettier format check

**lint-staged scope:**
- YAML/JSON/HTML/CSS/MD: Prettier only
- Source files (`{apps,packages}/src/**/*.{ts,tsx,...}`): Prettier + ESLint fix

## CI/CD (GitHub Actions)

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | Push/PR to `main` | Build → Lint → Type-check → Test → manypkg check → Prettier check |
| `db-migrations.yml` | Push to `main` | Runs `db:migrate` against production DB |
| `playwright.yml` | Push/PR to `main` | Builds the app, runs Playwright E2E across Chromium/Firefox/WebKit |
| `deploy-gh-pages.yml` | (see workflow) | Deploys Storybook to GitHub Pages |

CI uses Turborepo remote caching (`TURBO_TOKEN` / `TURBO_TEAM` secrets).

## Dependency Management

All versions are centralized in the `catalog:` section of `pnpm-workspace.yaml`. When adding a new dependency:

1. Add the version to the catalog in `pnpm-workspace.yaml`.
2. Reference it as `"package": "catalog:"` in the `package.json` of the consuming package.
3. Run `pnpm manypkg check` to validate consistency.

Use `pnpm dedupe` to clean up duplicate versions after adding packages.

## Turborepo Task Graph

Key dependency relationships:
- `build` depends on all upstream `^build` (packages build before apps)
- `dev` depends on upstream `^build` (packages must be built before app dev server)
- `lint`, `type-check` depend on upstream `^build`
- `e2e` depends on `build`
- `db:migrate` / `db:push` depend on upstream `^db:generate`

Global environment variables tracked by Turbo: `DATABASE_URL`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NODE_ENV`, etc.

## DevContainer / Codespaces

A `.devcontainer/` configuration is provided. Open the repo in VS Code with Docker installed and Dev Containers extension to get a fully configured environment.

## Key File Locations

| Purpose | Path |
|---|---|
| DB schema | `packages/db/src/schema.ts` |
| tRPC root router | `packages/api/src/root.ts` |
| NextAuth config | `packages/auth/index.ts` |
| Next.js app entry | `apps/vubnguyen/src/app/layout.tsx` |
| Blog post registry | `apps/vubnguyen/src/lib/posts.ts` |
| Env var validation | `apps/vubnguyen/src/env.mjs` |
| Tailwind config | `apps/vubnguyen/tailwind.config.ts` |
| Global CSS / CSS vars | `apps/vubnguyen/src/styles/globals.css` |
| Prettier config | `prettier.config.mjs` |
| Workspace catalog | `pnpm-workspace.yaml` |
| Turbo pipeline | `turbo.json` |
