// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `procurement.supplier_invoices`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface ProcurementSupplierInvoicesRow {
  supplier_id: string; // UUID
  purchase_order_id: string | null; // UUID
  invoice_number: string; // VARCHAR(128)
  invoice_date: string; // DATE
  due_date: string | null; // DATE
  grand_total: string; // NUMERIC(16, 2)
  currency: string; // VARCHAR(3)
  status: string; // VARCHAR(32)
  document_file_id: string | null; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
