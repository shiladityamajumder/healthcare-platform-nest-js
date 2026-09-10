// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `platform.scheduled_jobs`. */
// Describe the database row shape consumed by repositories and transaction code.
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
