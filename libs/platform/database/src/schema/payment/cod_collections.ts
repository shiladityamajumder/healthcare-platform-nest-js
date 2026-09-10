/** Raw PostgreSQL row shape for `payment.cod_collections`. */
export interface PaymentCodCollectionsRow {
  shipment_id: string; // UUID
  order_id: string; // UUID
  amount: string; // NUMERIC(16, 2)
  collected_by_user_id: string | null; // UUID
  collected_at: Date | null; // TIMESTAMP WITH TIME ZONE
  remitted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
