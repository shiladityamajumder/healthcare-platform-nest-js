// * Describes the raw PostgreSQL row shape for the marketplace.sellers table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `marketplace.sellers`. */
export interface MarketplaceSellersRow {
  organization_id: string; // UUID
  seller_code: string; // VARCHAR(64)
  display_name: string; // VARCHAR(255)
  seller_type: string; // VARCHAR(32)
  verification_status: string; // VARCHAR(16)
  status: string; // VARCHAR(32)
  commission_plan_id: string | null; // UUID
  settlement_cycle: string; // VARCHAR(32)
  is_active: boolean; // BOOLEAN
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
