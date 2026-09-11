// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `clinical.prescription_documents`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
