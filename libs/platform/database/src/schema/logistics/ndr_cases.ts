// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `logistics.ndr_cases`. */
// Describe the database row shape consumed by repositories and transaction code.
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
