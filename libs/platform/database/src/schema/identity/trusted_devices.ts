/** Raw PostgreSQL row shape for `identity.trusted_devices`. */
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
