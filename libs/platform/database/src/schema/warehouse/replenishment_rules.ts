// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `warehouse.replenishment_rules`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface WarehouseReplenishmentRulesRow {
  warehouse_id: string; // UUID
  product_id: string; // UUID
  variant_id: string | null; // UUID
  minimum_qty: string; // NUMERIC(16, 3)
  maximum_qty: string; // NUMERIC(16, 3)
  reorder_qty: string; // NUMERIC(16, 3)
  preferred_supplier_id: string | null; // UUID
  is_active: boolean; // BOOLEAN
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  is_deleted: boolean; // BOOLEAN
  deleted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  deleted_by: string | null; // UUID
  row_version: string; // BIGINT
}
