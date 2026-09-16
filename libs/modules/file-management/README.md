# File management bounded context

<p><img src="https://img.shields.io/badge/Domain-File%20Management-475569?logo=files&logoColor=white" alt="File management bounded context" /></p>

File upload lifecycle, metadata, deletion, and controlled access URLs.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. Its handlers return `not-implemented`; no storage provider, file scan, or file API is live.

## Feature inventory

- `initiate-upload` — create an upload session
- `complete-upload` — finalize an upload
- `get-file` — read file metadata
- `generate-download-url` — issue a controlled download URL
- `delete-file` — delete or tombstone a file

The feature folders contain the intended module, controller, command, request/response DTOs, handler, and focused test shape. Before activation, implement object-storage adapters, ownership/tenant authorization, content validation and scanning, expiry, audit logging, metadata persistence, and integration tests.

## Boundary rules

Consumers may import only `src/public-api.ts` through `@modules/file-management`. Keep storage credentials, provider clients, signed URL logic, and SQL private. Do not place file bytes or secrets in the shared kernel or application logs.
