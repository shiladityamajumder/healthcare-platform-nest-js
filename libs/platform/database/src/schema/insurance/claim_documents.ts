// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `insurance.claim_documents`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface InsuranceClaimDocumentsRow {
  claim_id: string; // UUID
  document_type: string; // VARCHAR(64)
  file_object_id: string; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
