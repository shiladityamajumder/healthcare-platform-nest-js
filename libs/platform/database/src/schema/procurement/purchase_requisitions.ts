// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `procurement.purchase_requisitions`. */
// Describe the database row shape consumed by repositories and transaction code.
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
