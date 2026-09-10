// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `procurement.goods_receipt_quality_checks`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface ProcurementGoodsReceiptQualityChecksRow {
  goods_receipt_item_id: string; // UUID
  check_type: string; // VARCHAR(64)
  result: string; // VARCHAR(32)
  checked_by_user_id: string; // UUID
  checked_at: Date; // TIMESTAMP WITH TIME ZONE
  observations: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
