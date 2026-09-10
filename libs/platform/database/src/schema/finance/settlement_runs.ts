// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `finance.settlement_runs`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface FinanceSettlementRunsRow {
  run_number: string; // VARCHAR(64)
  seller_id: string; // UUID
  period_start: string; // DATE
  period_end: string; // DATE
  currency: string; // VARCHAR(3)
  gross_amount: string; // NUMERIC(18, 2)
  commission_amount: string; // NUMERIC(18, 2)
  tax_withheld: string; // NUMERIC(18, 2)
  adjustments: string; // NUMERIC(18, 2)
  net_amount: string; // NUMERIC(18, 2)
  status: string; // VARCHAR(32)
  paid_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
