# API contracts

Base path: `/api/v1`.

## Health

`GET /health` returns `{ "data": { "status": "ok", "timestamp": "ISO-8601" } }`.

## Projects

`GET /projects` returns `{ "data": Project[] }`. `GET /projects/:slug` returns `{ "data": Project }`, or a 404 error envelope `{ "error": { "code": "PROJECT_NOT_FOUND", "message": "Project not found" } }`.

The current repository is an in-memory placeholder used to demonstrate module boundaries. It includes no create/update endpoints and is not persisted. Future write endpoints must validate with shared Zod schemas, authenticate users, authorize by role, and rely on RLS as an additional control.

Errors use `{ "error": { "code": "...", "message": "..." } }`. Unexpected server errors return a generic message without exposing internal details.
