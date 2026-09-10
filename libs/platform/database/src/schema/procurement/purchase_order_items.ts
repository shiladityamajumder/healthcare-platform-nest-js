// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `procurement.purchase_order_items`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface ProcurementPurchaseOrderItemsRow {
  purchase_order_id: string; // UUID
  product_id: string; // UUID
  variant_id: string | null; // UUID
  supplier_product_id: string | null; // UUID
  ordered_qty: string; // NUMERIC(16, 3)
  received_qty: string; // NUMERIC(16, 3)
  unit_cost: string; // NUMERIC(14, 2)
  discount_amount: string; // NUMERIC(14, 2)
  tax_rate: string; // NUMERIC(7, 4)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
