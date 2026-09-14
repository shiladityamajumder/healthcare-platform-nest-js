// * Describes the raw PostgreSQL row shape for the logistics.shipment_events table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `logistics.shipment_events`. */
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
