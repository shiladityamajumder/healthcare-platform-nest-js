// * Linked with: ./family_members, ./addresses, ./consents.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the customer PostgreSQL schema. */
// * Describe the database row shape consumed by repositories and transaction code.
export type { CustomerFamilyMembersRow } from './family_members';
export type { CustomerAddressesRow } from './addresses';
export type { CustomerConsentsRow } from './consents';
export type { CustomerPreferencesRow } from './preferences';
export type { CustomerWishlistsRow } from './wishlists';
export type { CustomerProfilesRow } from './profiles';
export type { CustomerConsentEventsRow } from './consent_events';
export type { CustomerWishlistItemsRow } from './wishlist_items';
