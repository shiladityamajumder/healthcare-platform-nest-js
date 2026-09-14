// * Describes the raw PostgreSQL row shape for the logistics.delivery_attempts table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `logistics.delivery_attempts`. */
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
