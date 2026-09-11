// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `payment.cod_collections`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface PaymentCodCollectionsRow {
  shipment_id: string; // UUID
  order_id: string; // UUID
  amount: string; // NUMERIC(16, 2)
  collected_by_user_id: string | null; // UUID
  collected_at: Date | null; // TIMESTAMP WITH TIME ZONE
  remitted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
