/** Raw PostgreSQL row shape for `clinical.patient_profiles`. */
export interface ClinicalPatientProfilesRow {
  user_id: string | null; // UUID
  family_member_id: string | null; // UUID
  medical_record_number: string | null; // VARCHAR(64)
  abha_number_hash: string | null; // VARCHAR(128)
  abha_address_encrypted: Buffer | null; // BYTEA
  blood_group: string | null; // VARCHAR(8)
  emergency_contact: unknown; // JSONB
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
