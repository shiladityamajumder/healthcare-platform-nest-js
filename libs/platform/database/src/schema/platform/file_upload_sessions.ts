/** Raw PostgreSQL row shape for `platform.file_upload_sessions`. */
export interface PlatformFileUploadSessionsRow {
  file_object_id: string; // UUID
  requested_by_user_id: string | null; // UUID
  scope: string; // VARCHAR(128)
  idempotency_key: string; // VARCHAR(128)
  upload_method: string; // VARCHAR(32)
  multipart_upload_id: string | null; // VARCHAR(512)
  status: string; // VARCHAR(16)
  expires_at: Date; // TIMESTAMP WITH TIME ZONE
  completed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  aborted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  failure_reason: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
