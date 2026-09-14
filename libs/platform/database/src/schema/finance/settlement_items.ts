// * Describes the raw PostgreSQL row shape for the finance.settlement_items table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `finance.settlement_items`. */
export interface FinanceSettlementItemsRow {
  settlement_run_id: string; // UUID
  order_id: string; // UUID
  order_group_id: string | null; // UUID
  gross_amount: string; // NUMERIC(18, 2)
  commission_amount: string; // NUMERIC(18, 2)
  tax_amount: string; // NUMERIC(18, 2)
  adjustment_amount: string; // NUMERIC(18, 2)
  net_amount: string; // NUMERIC(18, 2)
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
