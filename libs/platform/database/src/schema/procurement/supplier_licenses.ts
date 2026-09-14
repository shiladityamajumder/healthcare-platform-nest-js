// * Describes the raw PostgreSQL row shape for the procurement.supplier_licenses table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `procurement.supplier_licenses`. */
export interface ProcurementSupplierLicensesRow {
  supplier_id: string; // UUID
  license_type: string; // VARCHAR(64)
  license_number: string; // VARCHAR(128)
  issued_at: string | null; // DATE
  expires_at: string | null; // DATE
  document_file_id: string | null; // UUID
  verification_status: string; // VARCHAR(16)
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
