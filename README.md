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

Copy `.env.example` to `apps/web/.env.local` and `apps/api/.env.example` to `apps/api/.env`. Set the public site URL, API URL, Supabase URL, and publishable key in the web file for `/admin` sign-in. Add the EmailJS service ID, template ID, and public key there to enable the public contact form. In the API file, use `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`; the API also accepts the equivalent `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` names. Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the API environment for project banners. The API uses the Supabase publishable key with RLS and does not need a service-role key for these reads, submissions, or admin actions. Keep secret keys out of frontend environment files and source control; EmailJS public keys are designed for browser use.

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

The website runs at <http://localhost:3000>. The API runs at <http://localhost:4000> with `GET /api/v1/health`, `GET /api/v1/projects`, `GET /api/v1/projects/:slug`, and `POST /api/v1/inquiries/newsletter`. The contact form sends directly to EmailJS from the browser and is not part of the admin workspace.

## Quality commands

```bash
npm run build
npm run lint
npm run format:check
npm test
```

## Database

Migrations are in `supabase/migrations`. Start a local Supabase stack using `supabase start`, then apply migrations with `supabase db reset`. For a linked hosted project, use `supabase db push` only when all migrations, including the initial schema, are recorded in Supabase's migration history. If you applied the initial migration manually in the SQL Editor, apply only the pending incremental migrations there; alternatively, reconcile the remote migration history before using `db push` so it does not try to recreate existing tables. `20261016000000_project_banners.sql` adds Cloudinary banner fields, `20261017000000_admin_content_and_programs.sql` seeds standard program categories and adds gallery, networks, and notices tables, and `20261018000000_notice_photos.sql` adds notice photo fields. Apply pending migrations before deploying the updated API. Review `docs/database-schema.md` before changing access policies.

## Deployment

- Deploy `apps/web` to Vercel with the app root set to `apps/web`; set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` in the project environment.
- Deploy `apps/api` to a Node.js hosting provider with the root/build configuration for the workspace, start command `npm --workspace @relief-nepal/api start`, `PORT`, `FRONTEND_ORIGINS`, and the Supabase URL/publishable key. Set the production frontend origin explicitly. The frontend does not need Supabase credentials because it calls the REST API.
- Apply Supabase migrations in each environment. Keep service/secret keys only in backend secrets. Configure Auth redirect URLs and Storage policies for the deployed domains.

See `docs/architecture.md`, `docs/database-schema.md`, and `docs/api-contracts.md` for boundaries and planned schema.

## Admin workspace

Open `/admin` and sign in with a Supabase Auth email/password account. See [docs/admin-workspace.md](docs/admin-workspace.md) for granting the first admin profile and managing projects, content, and newsletter subscribers.
