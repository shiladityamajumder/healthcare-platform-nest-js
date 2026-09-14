// * Describes the raw PostgreSQL row shape for the customer.consents table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `customer.consents`. */
export interface CustomerConsentsRow {
  user_id: string; // UUID
  consent_type: string; // VARCHAR(64)
  version: string; // VARCHAR(32)
  purpose: string; // VARCHAR(128)
  status: string; // VARCHAR(16)
  granted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  withdrawn_at: Date | null; // TIMESTAMP WITH TIME ZONE
  expires_at: Date | null; // TIMESTAMP WITH TIME ZONE
  source: string; // VARCHAR(32)
  evidence: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
