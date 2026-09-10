// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `identity.trusted_devices`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface IdentityTrustedDevicesRow {
  user_id: string; // UUID
  device_fingerprint_hash: string; // VARCHAR(128)
  device_name: string | null; // VARCHAR(128)
  trusted_until: Date | null; // TIMESTAMP WITH TIME ZONE
  last_seen_at: Date | null; // TIMESTAMP WITH TIME ZONE
  revoked_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
