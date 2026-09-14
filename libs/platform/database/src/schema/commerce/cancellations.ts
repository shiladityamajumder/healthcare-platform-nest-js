// * Describes the raw PostgreSQL row shape for the commerce.cancellations table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `commerce.cancellations`. */
export interface CommerceCancellationsRow {
  order_id: string; // UUID
  requested_by_user_id: string; // UUID
  reason_code: string; // VARCHAR(64)
  reason_text: string | null; // TEXT
  status: string; // VARCHAR(32)
  approved_by_user_id: string | null; // UUID
  resolved_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
