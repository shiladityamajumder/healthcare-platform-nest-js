// * Describes the raw PostgreSQL row shape for the marketplace.seller_commission_assignments table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `marketplace.seller_commission_assignments`. */
export interface MarketplaceSellerCommissionAssignmentsRow {
  seller_id: string; // UUID
  commission_plan_id: string; // UUID
  valid_from: Date; // TIMESTAMP WITH TIME ZONE
  valid_until: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
