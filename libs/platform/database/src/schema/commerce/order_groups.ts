// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `commerce.order_groups`. */
// Describe the database row shape consumed by repositories and transaction code.
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
