// * Describes the raw PostgreSQL row shape for the payment.provider_accounts table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `payment.provider_accounts`. */
export interface PaymentProviderAccountsRow {
  provider: string; // VARCHAR(64)
  merchant_account_ref: string; // VARCHAR(255)
  credentials_secret_ref: string; // VARCHAR(255)
  supported_methods: unknown; // JSONB
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
