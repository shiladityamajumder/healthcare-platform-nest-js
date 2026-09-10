/** Raw PostgreSQL row shape for `diagnostics.sample_collections`. */
export interface DiagnosticsSampleCollectionsRow {
  diagnostic_order_id: string; // UUID
  collector_user_id: string | null; // UUID
  scheduled_at: Date | null; // TIMESTAMP WITH TIME ZONE
  arrived_at: Date | null; // TIMESTAMP WITH TIME ZONE
  collected_at: Date | null; // TIMESTAMP WITH TIME ZONE
  status: string; // VARCHAR(32)
  notes: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
