// * Describes the raw PostgreSQL row shape for the commerce.returns table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `commerce.returns`. */
export interface CommerceReturnsRow {
  return_number: string; // VARCHAR(64)
  order_id: string; // UUID
  user_id: string; // UUID
  status: string; // VARCHAR(32)
  reason_code: string; // VARCHAR(64)
  pickup_required: boolean; // BOOLEAN
  requested_at: Date; // TIMESTAMP WITH TIME ZONE
  completed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
