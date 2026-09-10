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
