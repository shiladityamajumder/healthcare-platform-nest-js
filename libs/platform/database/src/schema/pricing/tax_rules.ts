// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `pricing.tax_rules`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface PricingTaxRulesRow {
  tax_code: string; // VARCHAR(64)
  country_code: string; // VARCHAR(2)
  state_code: string | null; // VARCHAR(8)
  rate: string; // NUMERIC(7, 4)
  valid_from: string; // DATE
  valid_until: string | null; // DATE
  reverse_charge: boolean; // BOOLEAN
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
