// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `logistics.delivery_assignments`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface LogisticsDeliveryAssignmentsRow {
  shipment_id: string; // UUID
  route_id: string | null; // UUID
  delivery_user_id: string; // UUID
  sequence_no: number | null; // INTEGER
  assigned_at: Date; // TIMESTAMP WITH TIME ZONE
  accepted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  completed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
