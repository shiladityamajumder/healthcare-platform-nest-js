// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `marketplace.seller_locations`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface MarketplaceSellerLocationsRow {
  seller_id: string; // UUID
  location_id: string; // UUID
  warehouse_id: string | null; // UUID
  fulfillment_mode: string; // VARCHAR(32)
  is_active: boolean; // BOOLEAN
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
