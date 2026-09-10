// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `payment.provider_accounts`. */
// Describe the database row shape consumed by repositories and transaction code.
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
