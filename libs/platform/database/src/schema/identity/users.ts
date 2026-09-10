/** Raw PostgreSQL row shape for `identity.users`. */
export interface IdentityUsersRow {
  email: string | null; // VARCHAR(320)
  email_normalized: string | null; // VARCHAR(320)
  phone_country_code: string | null; // VARCHAR(8)
  phone_number: string | null; // VARCHAR(32)
  password_hash: string | null; // VARCHAR(255)
  status: string; // VARCHAR(16)
  email_verified_at: Date | null; // TIMESTAMP WITH TIME ZONE
  phone_verified_at: Date | null; // TIMESTAMP WITH TIME ZONE
  last_login_at: Date | null; // TIMESTAMP WITH TIME ZONE
  failed_login_count: number; // INTEGER
  locked_until: Date | null; // TIMESTAMP WITH TIME ZONE
  preferred_locale: string; // VARCHAR(16)
  timezone: string; // VARCHAR(64)
  terms_version: string | null; // VARCHAR(32)
  privacy_version: string | null; // VARCHAR(32)
  account_closed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
