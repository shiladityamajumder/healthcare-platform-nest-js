// * Describes the raw PostgreSQL row shape for the finance.accounts table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `finance.accounts`. */
export interface FinanceAccountsRow {
  account_code: string; // VARCHAR(64)
  name: string; // VARCHAR(255)
  account_type: string; // VARCHAR(32)
  parent_account_id: string | null; // UUID
  currency: string | null; // VARCHAR(3)
  status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  is_deleted: boolean; // BOOLEAN
  deleted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  deleted_by: string | null; // UUID
  row_version: string; // BIGINT
}
