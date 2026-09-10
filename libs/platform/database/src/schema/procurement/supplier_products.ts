/** Raw PostgreSQL row shape for `procurement.supplier_products`. */
export interface ProcurementSupplierProductsRow {
  supplier_id: string; // UUID
  product_id: string; // UUID
  variant_id: string | null; // UUID
  supplier_sku: string; // VARCHAR(128)
  minimum_order_qty: string; // NUMERIC(16, 3)
  lead_time_days: number; // INTEGER
  last_purchase_cost: string | null; // NUMERIC(14, 2)
  is_preferred: boolean; // BOOLEAN
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
