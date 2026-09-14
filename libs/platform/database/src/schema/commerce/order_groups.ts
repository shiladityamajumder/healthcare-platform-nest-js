// * Describes the raw PostgreSQL row shape for the commerce.order_groups table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `commerce.order_groups`. */
export interface CommerceOrderGroupsRow {
  order_id: string; // UUID
  group_number: number; // INTEGER
  seller_id: string | null; // UUID
  warehouse_id: string | null; // UUID
  status: string; // VARCHAR(32)
  delivery_promise_start: Date | null; // TIMESTAMP WITH TIME ZONE
  delivery_promise_end: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
