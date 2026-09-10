// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `logistics.shipment_events`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface LogisticsShipmentEventsRow {
  shipment_id: string; // UUID
  carrier_id: string | null; // UUID
  provider_event_id: string | null; // VARCHAR(255)
  event_code: string; // VARCHAR(64)
  status: string; // VARCHAR(32)
  description: string | null; // TEXT
  location: string | null; // VARCHAR(255)
  event_time: Date; // TIMESTAMP WITH TIME ZONE
  raw_payload: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
