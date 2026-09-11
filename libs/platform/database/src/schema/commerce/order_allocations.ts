// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `commerce.order_allocations`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface CommerceOrderAllocationsRow {
  order_item_id: string; // UUID
  warehouse_id: string; // UUID
  seller_id: string | null; // UUID
  allocated_qty: string; // NUMERIC(12, 3)
  status: string; // VARCHAR(32)
  reservation_id: string | null; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
