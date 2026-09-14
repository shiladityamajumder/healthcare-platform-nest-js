// * Describes the raw PostgreSQL row shape for the insurance.claim_documents table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `insurance.claim_documents`. */
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
