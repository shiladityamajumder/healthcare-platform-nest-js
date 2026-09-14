// * Describes the raw PostgreSQL row shape for the logistics.delivery_routes table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `logistics.delivery_routes`. */
export interface LogisticsDeliveryRoutesRow {
  route_number: string; // VARCHAR(64)
  warehouse_id: string; // UUID
  route_date: string; // DATE
  status: string; // VARCHAR(32)
  vehicle_identifier: string | null; // VARCHAR(128)
  delivery_user_id: string | null; // UUID
  route_geometry: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
