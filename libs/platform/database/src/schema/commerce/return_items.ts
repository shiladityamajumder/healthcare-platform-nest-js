// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `commerce.return_items`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface CommerceReturnItemsRow {
  return_id: string; // UUID
  order_item_id: string; // UUID
  quantity: string; // NUMERIC(12, 3)
  condition: string | null; // VARCHAR(32)
  resolution: string; // VARCHAR(32)
  approved_qty: string | null; // NUMERIC(12, 3)
  inspection_notes: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
