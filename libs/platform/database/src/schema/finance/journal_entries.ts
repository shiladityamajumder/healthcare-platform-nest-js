/** Raw PostgreSQL row shape for `finance.journal_entries`. */
export interface FinanceJournalEntriesRow {
  entry_number: string; // VARCHAR(64)
  entry_date: string; // DATE
  reference_type: string; // VARCHAR(64)
  reference_id: string; // UUID
  description: string | null; // TEXT
  status: string; // VARCHAR(32)
  posted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  reversed_entry_id: string | null; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
