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
