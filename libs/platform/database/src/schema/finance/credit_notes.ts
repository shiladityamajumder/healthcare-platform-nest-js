// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `finance.credit_notes`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
