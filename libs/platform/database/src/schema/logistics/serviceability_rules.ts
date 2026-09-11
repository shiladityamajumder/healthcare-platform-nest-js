// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `logistics.serviceability_rules`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface LogisticsServiceabilityRulesRow {
  carrier_id: string; // UUID
  origin_postal_code: string; // VARCHAR(16)
  destination_postal_code: string; // VARCHAR(16)
  service_type: string; // VARCHAR(32)
  estimated_days: number; // INTEGER
  cod_supported: boolean; // BOOLEAN
  cold_chain_supported: boolean; // BOOLEAN
  max_weight_grams: number | null; // INTEGER
  active_from: string | null; // DATE
  active_until: string | null; // DATE
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
