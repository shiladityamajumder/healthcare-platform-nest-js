// * Describes the raw PostgreSQL row shape for the warehouse.stock_reservations table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `warehouse.stock_reservations`. */
export interface WarehouseStockReservationsRow {
  reservation_number: string; // VARCHAR(64)
  order_id: string; // UUID
  order_item_id: string; // UUID
  warehouse_id: string; // UUID
  bin_id: string | null; // UUID
  lot_id: string; // UUID
  quantity: string; // NUMERIC(16, 3)
  status: string; // VARCHAR(16)
  expires_at: Date; // TIMESTAMP WITH TIME ZONE
  released_at: Date | null; // TIMESTAMP WITH TIME ZONE
  committed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
