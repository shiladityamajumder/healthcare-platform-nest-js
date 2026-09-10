/** Raw PostgreSQL row shape for `compliance.evidence`. */
export interface ComplianceEvidenceRow {
  category: string; // VARCHAR(64)
  reference_type: string; // VARCHAR(64)
  reference_id: string; // UUID
  evidence_type: string; // VARCHAR(64)
  file_object_id: string | null; // UUID
  payload_hash: string | null; // VARCHAR(64)
  metadata_json: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
