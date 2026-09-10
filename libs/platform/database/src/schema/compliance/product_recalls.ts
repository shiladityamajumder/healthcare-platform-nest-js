/** Raw PostgreSQL row shape for `compliance.product_recalls`. */
export interface ComplianceProductRecallsRow {
  recall_number: string; // VARCHAR(64)
  product_id: string; // UUID
  authority_id: string | null; // UUID
  recall_class: string | null; // VARCHAR(32)
  reason: string; // TEXT
  status: string; // VARCHAR(32)
  announced_at: Date; // TIMESTAMP WITH TIME ZONE
  closed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
