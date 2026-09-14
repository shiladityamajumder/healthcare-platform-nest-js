// * Describes the raw PostgreSQL row shape for the clinical.prescription_documents table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `clinical.prescription_documents`. */
export interface ClinicalPrescriptionDocumentsRow {
  prescription_id: string; // UUID
  file_object_id: string; // UUID
  redaction_status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
