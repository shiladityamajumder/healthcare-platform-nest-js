// * Re-exports the typed PostgreSQL row shapes for the marketplace schema.
// * Used by repositories that need compile-time row types without ORM entities.
// ! These exports describe an existing database; they do not create or modify tables.
/** Row shapes for the marketplace PostgreSQL schema. */
export type { MarketplaceCommissionPlansRow } from './commission_plans';
export type { MarketplaceSellersRow } from './sellers';
export type { MarketplaceSellerCommissionAssignmentsRow } from './seller_commission_assignments';
export type { MarketplaceSellerRatingsRow } from './seller_ratings';
export type { MarketplaceSellerServiceLevelsRow } from './seller_service_levels';
export type { MarketplaceSellerLocationsRow } from './seller_locations';
export type { MarketplaceSellerProductListingsRow } from './seller_product_listings';
