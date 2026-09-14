// * Describes the raw PostgreSQL row shape for the warehouse.replenishment_rules table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `warehouse.replenishment_rules`. */
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
