/** Raw PostgreSQL row shape for `commerce.carts`. */
export interface CommerceCartsRow {
  user_id: string | null; // UUID
  anonymous_token: string | null; // VARCHAR(128)
  currency: string; // VARCHAR(3)
  status: string; // VARCHAR(16)
  expires_at: Date | null; // TIMESTAMP WITH TIME ZONE
  merged_into_cart_id: string | null; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
