// * Describes the raw PostgreSQL row shape for the customer.addresses table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `customer.addresses`. */
export interface CustomerAddressesRow {
  user_id: string; // UUID
  label: string | null; // VARCHAR(64)
  recipient_name: string; // VARCHAR(150)
  recipient_phone: string; // VARCHAR(32)
  line1: string; // VARCHAR(255)
  line2: string | null; // VARCHAR(255)
  landmark: string | null; // VARCHAR(255)
  locality: string | null; // VARCHAR(150)
  city: string; // VARCHAR(100)
  district: string | null; // VARCHAR(100)
  state: string; // VARCHAR(100)
  state_code: string | null; // VARCHAR(8)
  postal_code: string; // VARCHAR(16)
  country_code: string; // VARCHAR(2)
  latitude: string | null; // NUMERIC(10, 7)
  longitude: string | null; // NUMERIC(10, 7)
  is_default: boolean; // BOOLEAN
  validation_status: string; // VARCHAR(32)
  validation_provider: string | null; // VARCHAR(64)
  validated_at: Date | null; // TIMESTAMP WITH TIME ZONE
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
