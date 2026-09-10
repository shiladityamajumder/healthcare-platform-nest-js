/** Raw PostgreSQL row shape for `procurement.goods_receipt_quality_checks`. */
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
