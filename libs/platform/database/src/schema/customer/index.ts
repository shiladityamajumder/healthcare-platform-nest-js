// * Re-exports the typed PostgreSQL row shapes for the customer schema.
// * Used by repositories that need compile-time row types without ORM entities.
// ! These exports describe an existing database; they do not create or modify tables.
/** Row shapes for the customer PostgreSQL schema. */
export type { CustomerFamilyMembersRow } from './family_members';
export type { CustomerAddressesRow } from './addresses';
export type { CustomerConsentsRow } from './consents';
export type { CustomerPreferencesRow } from './preferences';
export type { CustomerWishlistsRow } from './wishlists';
export type { CustomerProfilesRow } from './profiles';
export type { CustomerConsentEventsRow } from './consent_events';
export type { CustomerWishlistItemsRow } from './wishlist_items';
