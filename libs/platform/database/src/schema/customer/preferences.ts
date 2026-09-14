// * Describes the raw PostgreSQL row shape for the customer.preferences table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `customer.preferences`. */
export interface CustomerPreferencesRow {
  user_id: string; // UUID
  language: string; // VARCHAR(16)
  communication_channels: unknown; // JSONB
  substitution_preference: string; // VARCHAR(32)
  delivery_instructions: string | null; // TEXT
  timezone: string; // VARCHAR(64)
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
