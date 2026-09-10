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
