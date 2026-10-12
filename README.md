# Relief Nepal platform starter

JavaScript monorepo starter for a modern, accessible public NGO website. It contains a Next.js App Router frontend, modular Express REST API, shared Zod schemas, and an initial Supabase migration. The site copy and project records are labeled placeholders until verified organizational content is supplied.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer
- Supabase project only when connecting real data (the starter currently runs without it)

## Install

From the repository root:

```bash
npm install
```

Copy `.env.example` to `apps/web/.env.local` and `apps/api/.env`. Fill the public website URL, API URL, Supabase URL and publishable key as needed. The API's `SUPABASE_SECRET_KEY` is server-only; never prefix it with `NEXT_PUBLIC_` or place it in frontend environment files. The health and sample project endpoints do not require Supabase credentials.

## Run

Run both development servers:

```bash
npm run dev
```

Or run either app independently:

```bash
npm run dev:web
npm run dev:api
```

The website runs at <http://localhost:3000>. The API runs at <http://localhost:4000> with `GET /api/v1/health`, `GET /api/v1/projects`, and `GET /api/v1/projects/sample-community-project`.

## Quality commands

```bash
npm run build
npm run lint
npm run format:check
npm test
```

## Database

The initial migration is in `supabase/migrations`. With Supabase CLI installed and linked, apply migrations using `supabase db push`; start a local Supabase stack using `supabase start`. Review `docs/database-schema.md` before adding domain tables or changing access policies.

## Deployment

- Deploy `apps/web` to Vercel with the app root set to `apps/web`; set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the project environment.
- Deploy `apps/api` to a Node.js hosting provider with the root/build configuration for the workspace, start command `npm --workspace @relief-nepal/api start`, `PORT`, `FRONTEND_ORIGINS`, and server-only Supabase credentials. Set the production frontend origin explicitly.
- Apply Supabase migrations in each environment. Keep service/secret keys only in backend secrets. Configure Auth redirect URLs and Storage policies for the deployed domains.

See `docs/architecture.md`, `docs/database-schema.md`, and `docs/api-contracts.md` for boundaries and planned schema.
