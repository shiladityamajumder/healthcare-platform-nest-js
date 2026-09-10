// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `warehouse.inventory_lots`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface WarehouseInventoryLotsRow {
  warehouse_id: string; // UUID
  product_id: string; // UUID
  variant_id: string | null; // UUID
  supplier_id: string | null; // UUID
  goods_receipt_item_id: string | null; // UUID
  batch_number: string; // VARCHAR(128)
  manufactured_at: string | null; // DATE
  expires_at: string; // DATE
  purchase_cost: string | null; // NUMERIC(14, 2)
  mrp: string; // NUMERIC(14, 2)
  quality_status: string; // VARCHAR(16)
  recall_status: string; // VARCHAR(32)
  received_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
