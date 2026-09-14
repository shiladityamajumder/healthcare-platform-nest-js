// * Describes the raw PostgreSQL row shape for the procurement.purchase_returns table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `procurement.purchase_returns`. */
export interface ProcurementPurchaseReturnsRow {
  return_number: string; // VARCHAR(64)
  supplier_id: string; // UUID
  warehouse_id: string; // UUID
  status: string; // VARCHAR(32)
  reason: string; // VARCHAR(255)
  dispatched_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
