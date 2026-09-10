/** Raw PostgreSQL row shape for `commerce.order_items`. */
export interface CommerceOrderItemsRow {
  order_id: string; // UUID
  order_group_id: string | null; // UUID
  product_id: string; // UUID
  variant_id: string | null; // UUID
  seller_id: string | null; // UUID
  product_snapshot: unknown; // JSONB
  quantity: string; // NUMERIC(12, 3)
  unit_mrp: string; // NUMERIC(14, 2)
  unit_price: string; // NUMERIC(14, 2)
  discount_amount: string; // NUMERIC(14, 2)
  tax_amount: string; // NUMERIC(14, 2)
  line_total: string; // NUMERIC(16, 2)
  prescription_id: string | null; // UUID
  status: string; // VARCHAR(32)
  returnable_until: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
