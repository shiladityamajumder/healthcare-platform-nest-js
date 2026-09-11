// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `logistics.reverse_shipments`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface LogisticsReverseShipmentsRow {
  reverse_shipment_number: string; // VARCHAR(64)
  return_id: string; // UUID
  carrier_id: string | null; // UUID
  tracking_number: string | null; // VARCHAR(128)
  status: string; // VARCHAR(32)
  pickup_scheduled_at: Date | null; // TIMESTAMP WITH TIME ZONE
  received_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
