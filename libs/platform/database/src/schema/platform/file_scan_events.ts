// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `platform.file_scan_events`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface PlatformFileScanEventsRow {
  file_object_id: string; // UUID
  scanner: string; // VARCHAR(64)
  status: string; // VARCHAR(32)
  signature_version: string | null; // VARCHAR(64)
  findings: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
