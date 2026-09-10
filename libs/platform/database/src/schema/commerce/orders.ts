/** Raw PostgreSQL row shape for `commerce.orders`. */
export interface CommerceOrdersRow {
  order_number: string; // VARCHAR(64)
  user_id: string; // UUID
  checkout_id: string | null; // UUID
  status: string; // VARCHAR(19)
  currency: string; // VARCHAR(3)
  subtotal: string; // NUMERIC(16, 2)
  discount_total: string; // NUMERIC(16, 2)
  tax_total: string; // NUMERIC(16, 2)
  shipping_total: string; // NUMERIC(16, 2)
  other_charges_total: string; // NUMERIC(16, 2)
  grand_total: string; // NUMERIC(16, 2)
  payment_status: string; // VARCHAR(32)
  fulfillment_status: string; // VARCHAR(32)
  prescription_status: string; // VARCHAR(32)
  shipping_address_snapshot: unknown; // JSONB
  billing_address_snapshot: unknown; // JSONB
  placed_at: Date; // TIMESTAMP WITH TIME ZONE
  confirmed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  cancelled_at: Date | null; // TIMESTAMP WITH TIME ZONE
  source_channel: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
