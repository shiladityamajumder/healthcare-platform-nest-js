/** Raw PostgreSQL row shape for `commerce.order_allocations`. */
export interface CommerceOrderAllocationsRow {
  order_item_id: string; // UUID
  warehouse_id: string; // UUID
  seller_id: string | null; // UUID
  allocated_qty: string; // NUMERIC(12, 3)
  status: string; // VARCHAR(32)
  reservation_id: string | null; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
