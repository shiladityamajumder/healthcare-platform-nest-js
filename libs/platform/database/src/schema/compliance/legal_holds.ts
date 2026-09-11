// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `compliance.legal_holds`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface ComplianceLegalHoldsRow {
  hold_number: string; // VARCHAR(64)
  reason: string; // TEXT
  scope: unknown; // JSONB
  status: string; // VARCHAR(32)
  effective_at: Date; // TIMESTAMP WITH TIME ZONE
  released_at: Date | null; // TIMESTAMP WITH TIME ZONE
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
