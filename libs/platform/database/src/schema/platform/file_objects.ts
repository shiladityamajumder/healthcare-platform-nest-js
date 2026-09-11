// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `platform.file_objects`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface PlatformFileObjectsRow {
  storage_provider: string; // VARCHAR(32)
  bucket: string; // VARCHAR(128)
  object_key: string; // VARCHAR(512)
  owner_type: string; // VARCHAR(64)
  owner_id: string; // UUID
  uploaded_by_user_id: string | null; // UUID
  original_filename: string; // VARCHAR(255)
  content_type: string; // VARCHAR(128)
  expected_size_bytes: string; // BIGINT
  size_bytes: string | null; // BIGINT
  sha256: string | null; // VARCHAR(64)
  etag: string | null; // VARCHAR(255)
  storage_version_id: string | null; // VARCHAR(255)
  encryption_key_ref: string | null; // VARCHAR(255)
  classification: string; // VARCHAR(32)
  access_type: string; // VARCHAR(16)
  status: string; // VARCHAR(16)
  malware_scan_status: string; // VARCHAR(16)
  public_url: string | null; // VARCHAR(2048)
  available_at: Date | null; // TIMESTAMP WITH TIME ZONE
  retention_until: Date | null; // TIMESTAMP WITH TIME ZONE
  metadata_json: unknown; // JSONB
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
