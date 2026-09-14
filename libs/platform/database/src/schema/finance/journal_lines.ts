// * Describes the raw PostgreSQL row shape for the finance.journal_lines table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `finance.journal_lines`. */
export interface FinanceJournalLinesRow {
  journal_entry_id: string; // UUID
  account_id: string; // UUID
  debit: string; // NUMERIC(18, 2)
  credit: string; // NUMERIC(18, 2)
  dimensions: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
