// * Describes the raw PostgreSQL row shape for the clinical.care_episodes table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `clinical.care_episodes`. */
export interface ClinicalCareEpisodesRow {
  patient_profile_id: string; // UUID
  episode_type: string; // VARCHAR(64)
  title: string; // VARCHAR(255)
  status: string; // VARCHAR(32)
  started_at: Date; // TIMESTAMP WITH TIME ZONE
  ended_at: Date | null; // TIMESTAMP WITH TIME ZONE
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
