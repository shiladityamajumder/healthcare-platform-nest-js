// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `finance.journal_lines`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface FinanceJournalLinesRow {
  journal_entry_id: string; // UUID
  account_id: string; // UUID
  debit: string; // NUMERIC(18, 2)
  credit: string; // NUMERIC(18, 2)
  dimensions: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
