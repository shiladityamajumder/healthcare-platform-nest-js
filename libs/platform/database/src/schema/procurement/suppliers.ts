/** Raw PostgreSQL row shape for `procurement.suppliers`. */
export interface ProcurementSuppliersRow {
  organization_id: string | null; // UUID
  supplier_code: string; // VARCHAR(64)
  name: string; // VARCHAR(255)
  contact_json: unknown; // JSONB
  payment_terms_days: number; // INTEGER
  verification_status: string; // VARCHAR(16)
  status: string; // VARCHAR(32)
  risk_rating: string | null; // VARCHAR(32)
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
