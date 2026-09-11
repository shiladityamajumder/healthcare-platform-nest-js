// * Linked with: ./commission_plans, ./sellers, ./seller_commission_assignments.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the marketplace PostgreSQL schema. */
// * Describe the database row shape consumed by repositories and transaction code.
export type { MarketplaceCommissionPlansRow } from './commission_plans';
export type { MarketplaceSellersRow } from './sellers';
export type { MarketplaceSellerCommissionAssignmentsRow } from './seller_commission_assignments';
export type { MarketplaceSellerRatingsRow } from './seller_ratings';
export type { MarketplaceSellerServiceLevelsRow } from './seller_service_levels';
export type { MarketplaceSellerLocationsRow } from './seller_locations';
export type { MarketplaceSellerProductListingsRow } from './seller_product_listings';
