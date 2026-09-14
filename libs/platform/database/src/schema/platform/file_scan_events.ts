// * Describes the raw PostgreSQL row shape for the platform.file_scan_events table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `platform.file_scan_events`. */
export interface PlatformFileScanEventsRow {
  file_object_id: string; // UUID
  scanner: string; // VARCHAR(64)
  status: string; // VARCHAR(32)
  signature_version: string | null; // VARCHAR(64)
  findings: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
