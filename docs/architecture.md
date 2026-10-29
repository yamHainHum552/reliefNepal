# Architecture

This repository is an npm-workspaces monorepo with two independently runnable applications and a small shared package. `apps/web` is a JavaScript Next.js App Router frontend deployed to Vercel. `apps/api` is a JavaScript ES module Express REST API suited to a Node.js host. Both remain separate processes; the browser calls the API under `/api/v1`.

The API groups code by domain. The projects module separates routes, controllers, service, repository, and constants. Validation schemas and shared enumerations live in `packages/shared`. Supabase Postgres is the source of persisted public content and private submissions; Auth and Storage are prepared for future workflows. The Express API uses the publishable key with RLS. The browser talks to the API and does not connect directly to Supabase. A service-role key is not needed for the current endpoints.

The public UI uses shared layout primitives and small domain components. Initial content is clearly marked as placeholder; no organizational achievements, figures, partner names, or photographs are asserted. Approved local photography can replace the illustrated asset under `apps/web/public/images`.

```text
apps/web/src/app/          App Router pages, route states, metadata, sitemap
apps/web/src/components/   Shared, layout, form, and domain components
apps/web/src/lib/          API, Supabase, SEO, utility integration points
apps/api/src/modules/      Modular API domains
packages/shared/           Cross-app constants and Zod schemas
supabase/migrations/       Version-controlled database changes
docs/                      Architecture, database, and API contracts
```
