// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `compliance.product_recalls`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface ComplianceProductRecallsRow {
  recall_number: string; // VARCHAR(64)
  product_id: string; // UUID
  authority_id: string | null; // UUID
  recall_class: string | null; // VARCHAR(32)
  reason: string; // TEXT
  status: string; // VARCHAR(32)
  announced_at: Date; // TIMESTAMP WITH TIME ZONE
  closed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
