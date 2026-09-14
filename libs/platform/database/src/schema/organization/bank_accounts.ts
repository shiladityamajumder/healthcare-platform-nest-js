// * Describes the raw PostgreSQL row shape for the organization.bank_accounts table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `organization.bank_accounts`. */
export interface OrganizationBankAccountsRow {
  organization_id: string; // UUID
  account_holder_name: string; // VARCHAR(255)
  account_number_encrypted: Buffer; // BYTEA
  account_number_last4: string; // VARCHAR(4)
  ifsc_code: string; // VARCHAR(16)
  bank_name: string | null; // VARCHAR(128)
  is_primary: boolean; // BOOLEAN
  verification_status: string; // VARCHAR(16)
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
