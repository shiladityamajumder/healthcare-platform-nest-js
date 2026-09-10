/** Raw PostgreSQL row shape for `platform.file_access_grants`. */
export interface PlatformFileAccessGrantsRow {
  file_object_id: string; // UUID
  subject_type: string; // VARCHAR(32)
  subject_id: string; // UUID
  permission: string; // VARCHAR(32)
  purpose: string; // VARCHAR(128)
  expires_at: Date | null; // TIMESTAMP WITH TIME ZONE
  revoked_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
