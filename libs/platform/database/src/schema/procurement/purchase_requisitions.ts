/** Raw PostgreSQL row shape for `procurement.purchase_requisitions`. */
export interface ProcurementPurchaseRequisitionsRow {
  requisition_number: string; // VARCHAR(64)
  warehouse_id: string; // UUID
  requested_by_user_id: string; // UUID
  status: string; // VARCHAR(32)
  priority: string; // VARCHAR(16)
  required_by: string | null; // DATE
  notes: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
