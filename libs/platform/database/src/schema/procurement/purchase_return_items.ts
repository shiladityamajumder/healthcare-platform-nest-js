// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `procurement.purchase_return_items`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface ProcurementPurchaseReturnItemsRow {
  purchase_return_id: string; // UUID
  lot_id: string; // UUID
  quantity: string; // NUMERIC(16, 3)
  reason_code: string; // VARCHAR(64)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
