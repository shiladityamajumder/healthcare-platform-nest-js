/** Raw PostgreSQL row shape for `logistics.ndr_cases`. */
export interface LogisticsNdrCasesRow {
  shipment_id: string; // UUID
  reason_code: string; // VARCHAR(64)
  status: string; // VARCHAR(32)
  next_action: string | null; // VARCHAR(64)
  next_attempt_at: Date | null; // TIMESTAMP WITH TIME ZONE
  customer_response: string | null; // VARCHAR(64)
  resolved_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
