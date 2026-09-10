/** Raw PostgreSQL row shape for `platform.scheduled_jobs`. */
export interface PlatformScheduledJobsRow {
  job_key: string; // VARCHAR(128)
  job_type: string; // VARCHAR(128)
  schedule_expression: string | null; // VARCHAR(128)
  payload: unknown; // JSONB
  status: string; // VARCHAR(32)
  next_run_at: Date | null; // TIMESTAMP WITH TIME ZONE
  last_run_at: Date | null; // TIMESTAMP WITH TIME ZONE
  locked_at: Date | null; // TIMESTAMP WITH TIME ZONE
  locked_by: string | null; // VARCHAR(128)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
