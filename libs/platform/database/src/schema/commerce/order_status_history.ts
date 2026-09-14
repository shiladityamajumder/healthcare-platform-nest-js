// * Describes the raw PostgreSQL row shape for the commerce.order_status_history table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `commerce.order_status_history`. */
export interface CommerceOrderStatusHistoryRow {
  order_id: string; // UUID
  from_status: string | null; // VARCHAR(32)
  to_status: string; // VARCHAR(32)
  reason_code: string | null; // VARCHAR(64)
  comment: string | null; // TEXT
  changed_by_user_id: string | null; // UUID
  changed_at: Date; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
