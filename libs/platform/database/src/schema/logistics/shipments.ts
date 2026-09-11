// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `logistics.shipments`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface LogisticsShipmentsRow {
  shipment_number: string; // VARCHAR(64)
  order_id: string; // UUID
  order_group_id: string | null; // UUID
  package_id: string; // UUID
  carrier_id: string; // UUID
  carrier_account_id: string | null; // UUID
  delivery_slot_id: string | null; // UUID
  tracking_number: string | null; // VARCHAR(128)
  status: string; // VARCHAR(16)
  service_type: string; // VARCHAR(32)
  shipping_label_file_id: string | null; // UUID
  estimated_delivery_at: Date | null; // TIMESTAMP WITH TIME ZONE
  dispatched_at: Date | null; // TIMESTAMP WITH TIME ZONE
  delivered_at: Date | null; // TIMESTAMP WITH TIME ZONE
  destination_snapshot: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
