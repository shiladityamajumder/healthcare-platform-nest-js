/** Raw PostgreSQL row shape for `finance.invoice_items`. */
export interface FinanceInvoiceItemsRow {
  invoice_id: string; // UUID
  order_item_id: string | null; // UUID
  description: string; // VARCHAR(255)
  hsn_code: string | null; // VARCHAR(32)
  quantity: string; // NUMERIC(12, 3)
  unit_price: string; // NUMERIC(14, 2)
  discount_amount: string; // NUMERIC(14, 2)
  tax_rate: string; // NUMERIC(7, 4)
  tax_amount: string; // NUMERIC(14, 2)
  line_total: string; // NUMERIC(16, 2)
  tax_breakup: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
