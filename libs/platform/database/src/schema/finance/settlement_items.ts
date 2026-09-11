// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `finance.settlement_items`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
