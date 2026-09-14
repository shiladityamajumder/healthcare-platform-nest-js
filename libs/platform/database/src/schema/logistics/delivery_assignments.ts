// * Describes the raw PostgreSQL row shape for the logistics.delivery_assignments table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `logistics.delivery_assignments`. */
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
