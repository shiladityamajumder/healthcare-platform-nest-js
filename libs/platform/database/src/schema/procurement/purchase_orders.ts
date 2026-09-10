/** Raw PostgreSQL row shape for `procurement.purchase_orders`. */
export interface ProcurementPurchaseOrdersRow {
  po_number: string; // VARCHAR(64)
  requisition_id: string | null; // UUID
  supplier_id: string; // UUID
  warehouse_id: string; // UUID
  status: string; // VARCHAR(32)
  ordered_at: Date | null; // TIMESTAMP WITH TIME ZONE
  expected_at: Date | null; // TIMESTAMP WITH TIME ZONE
  currency: string; // VARCHAR(3)
  subtotal: string; // NUMERIC(16, 2)
  discount_total: string; // NUMERIC(16, 2)
  tax_total: string; // NUMERIC(16, 2)
  grand_total: string; // NUMERIC(16, 2)
  approved_by_user_id: string | null; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
