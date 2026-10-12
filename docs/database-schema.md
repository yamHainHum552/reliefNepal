# Database schema plan

The initial migration creates `profiles`, `programs`, and `projects`, along with shared role, project status, and publication status enums. UUID primary keys, foreign keys, timestamps, uniqueness constraints, date checks, and listing indexes are included. Row Level Security (RLS) allows public reads of published programs and projects; authenticated editors and admins may manage content. Profile reads are limited to the profile owner, and profile management is restricted to admins.

Add the remaining entities as focused migrations when their workflows are designed:

| Entity | Planned relationships and controls |
| --- | --- |
| Project locations | Project foreign key; district and municipality foreign keys; indexed geography codes. |
| Districts and municipalities | Canonical geographic hierarchy, stable unique codes, and indexes. |
| Impact indicators | Project foreign key, unit, value, measurement date, source/verification metadata; never publish unverified values. |
| Stories and news posts | Optional project/program links; publication state, slug uniqueness, timestamps; public read for published records. |
| Partners | Organization records and optional relationship to programs/projects; public read only for approved entries. |
| Reports and financial documents | Storage object reference, report period, type, publication status; no public access to drafts. |
| Media assets | Storage path, media type, alt text, licensing/consent metadata, publication status. |
| Contact and partnership inquiries | Private submissions; no public select; restricted inserts and admin-only review. |
| Newsletter subscriptions | Private address data, consent timestamp, unsubscribe state; no public select. |
| Publication and audit logs | Actor, action, entity, timestamp, structured change metadata; append-only administrative access. |

Use one shared enum or constrained lookup table for publication status and user roles. Reporting periods should use explicit start/end dates and a documented period type. Administrative role assignment must be performed through a trusted server-side process; never allow users to self-assign elevated roles. Supabase service-role credentials belong only in backend secrets and bypass RLS, so use them sparingly and never in browser code.
