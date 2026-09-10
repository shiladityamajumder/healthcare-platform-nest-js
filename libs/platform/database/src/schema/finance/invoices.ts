/** Raw PostgreSQL row shape for `finance.invoices`. */
export interface FinanceInvoicesRow {
  invoice_number: string; // VARCHAR(64)
  order_id: string; // UUID
  seller_id: string | null; // UUID
  invoice_type: string; // VARCHAR(32)
  status: string; // VARCHAR(32)
  currency: string; // VARCHAR(3)
  subtotal: string; // NUMERIC(16, 2)
  discount_total: string; // NUMERIC(16, 2)
  shipping_total: string; // NUMERIC(16, 2)
  tax_total: string; // NUMERIC(16, 2)
  grand_total: string; // NUMERIC(16, 2)
  issued_at: Date; // TIMESTAMP WITH TIME ZONE
  supply_state_code: string | null; // VARCHAR(8)
  place_of_supply_code: string | null; // VARCHAR(8)
  document_file_id: string | null; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
