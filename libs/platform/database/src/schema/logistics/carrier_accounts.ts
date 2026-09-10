/** Raw PostgreSQL row shape for `logistics.carrier_accounts`. */
export interface LogisticsCarrierAccountsRow {
  carrier_id: string; // UUID
  account_code: string; // VARCHAR(64)
  credentials_secret_ref: string; // VARCHAR(255)
  service_types: unknown; // JSONB
  is_active: boolean; // BOOLEAN
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
