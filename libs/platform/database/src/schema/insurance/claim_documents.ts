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
