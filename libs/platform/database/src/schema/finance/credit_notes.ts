// * Describes the raw PostgreSQL row shape for the finance.credit_notes table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `finance.credit_notes`. */
export interface FinanceCreditNotesRow {
  credit_note_number: string; // VARCHAR(64)
  invoice_id: string; // UUID
  refund_id: string | null; // UUID
  amount: string; // NUMERIC(16, 2)
  reason: string; // VARCHAR(255)
  issued_at: Date; // TIMESTAMP WITH TIME ZONE
  document_file_id: string | null; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
