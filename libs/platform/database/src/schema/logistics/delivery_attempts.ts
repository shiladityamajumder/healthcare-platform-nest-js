// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `logistics.delivery_attempts`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface LogisticsDeliveryAttemptsRow {
  shipment_id: string; // UUID
  delivery_user_id: string | null; // UUID
  attempt_number: number; // INTEGER
  status: string; // VARCHAR(32)
  reason_code: string | null; // VARCHAR(64)
  proof_file_id: string | null; // UUID
  proof_metadata: unknown; // JSONB
  otp_verified: boolean; // BOOLEAN
  attempted_at: Date; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
