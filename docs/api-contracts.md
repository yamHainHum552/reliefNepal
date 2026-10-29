# API contracts

Base path: `/api/v1`.

## Health

`GET /health` returns `{ "data": { "status": "ok", "timestamp": "ISO-8601" } }`.

## Projects

`GET /projects` returns `{ "data": Project[] }`. `GET /projects/:slug` returns `{ "data": Project }`, or a 404 error envelope `{ "error": { "code": "PROJECT_NOT_FOUND", "message": "Project not found" } }`. Project responses include ordered `impact_metrics` (verified entries only) and `impact_details` arrays. Impact metrics expose label, value, unit, reporting period, measurement date, and source.

Project reads query Supabase and return only rows with `publication_status = published`. They rely on the Supabase publishable key and RLS; no service-role credential is used.

`GET /programs`, `/gallery`, `/networks`, and `/notices` return published, RLS-filtered records. Network records use the fixed `local_district` and `resource_provider` categories; `GET /networks/:slug` returns a published profile or 404. Public gallery results include the associated project and omit legacy media without a project; the web app groups remaining photos, videos, and audio under project albums. `GET /notices/:slug` returns one published notice or 404. Notice records may include an optional Cloudinary `image_url`, shown in the notice list and detail page. `GET /vacancies` returns open jobs with an unexpired or unset application deadline, and `GET /vacancies/:slug` returns an individual open vacancy or 404. Salary is displayed as negotiable. Projects include their assigned program and optional Cloudinary banner URL. Video gallery items use YouTube URLs and are embedded by the web app.

## Admin and Cloudinary uploads

Admin endpoints require a Supabase access token as a bearer token. `/admin/projects`, `/admin/gallery`, `/admin/vacancies`, `/admin/networks`, and `/admin/notices` support authenticated content management. Network records include a unique profile slug, one of the two fixed categories, logo reference, descriptions, optional location/contact/collaboration details, display order, and publication status. Duplicate profile slugs return HTTP 409. Gallery create requests require a valid existing `project_id`; project deletion is rejected while gallery items remain attached. Admin project records include verified and unverified impact metrics and editable impact details. Create and update project requests accept `impact_metrics: [{ label, value, unit, reporting_period, measured_on, source, verification_status }]` and `impact_details: [{ title, description }]`; impact lists are replaced atomically and may contain up to 50 entries each. `/admin/programs` lists the available program categories. `POST /admin/uploads/sign` returns a scoped signed upload request for a project banner, gallery photo, notice photo, or partner logo. Upload directly to Cloudinary, then send its response to `POST /admin/uploads/verify`; the API verifies Cloudinary's response signature before returning the asset reference. The Cloudinary API secret remains in the API environment.

## Submissions

The public Contact page sends messages directly to EmailJS from the browser; contact messages are not stored in the application database and are not exposed in the admin workspace. Configure the EmailJS service, template, and public key in the web app environment. The template should use `from_name`, `reply_to`, `email`, `subject`, `message`, and `time` variables. `POST /inquiries/newsletter` accepts `{ "email": "...", "consent": true }`, validates with the shared Zod schema, applies submission rate limits, and silently ignores a filled honeypot `website` field. Public database access can insert newsletter records but cannot read them.

The Express API must be configured with the Supabase project URL and publishable key. It accepts `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` or the Next-style aliases `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; copy `apps/api/.env.example` to the ignored `apps/api/.env` file. Apply migrations before accepting real submissions.

Errors use `{ "error": { "code": "...", "message": "..." } }`. Unexpected server errors return a generic message without exposing internal details.
