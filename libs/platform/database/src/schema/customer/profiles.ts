/** Raw PostgreSQL row shape for `customer.profiles`. */
export interface CustomerProfilesRow {
  user_id: string; // UUID
  first_name: string; // VARCHAR(100)
  last_name: string | null; // VARCHAR(100)
  date_of_birth: string | null; // DATE
  gender: string | null; // VARCHAR(32)
  avatar_file_id: string | null; // UUID
  default_address_id: string | null; // UUID
  marketing_opt_in: boolean; // BOOLEAN
  preferred_name: string | null; // VARCHAR(100)
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
