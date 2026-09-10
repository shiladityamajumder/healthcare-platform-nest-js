// Linked with: ./carts, ./checkouts, ./orders.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the commerce PostgreSQL schema. */
// Describe the database row shape consumed by repositories and transaction code.
export type { CommerceCartsRow } from './carts';
export type { CommerceCheckoutsRow } from './checkouts';
export type { CommerceOrdersRow } from './orders';
export type { CommerceOrderGroupsRow } from './order_groups';
export type { CommerceOrderChargesRow } from './order_charges';
export type { CommerceOrderStatusHistoryRow } from './order_status_history';
export type { CommerceCancellationsRow } from './cancellations';
export type { CommerceReturnsRow } from './returns';
export type { CommerceCartItemsRow } from './cart_items';
export type { CommerceOrderItemsRow } from './order_items';
export type { CommerceOrderDiscountsRow } from './order_discounts';
export type { CommerceCancellationItemsRow } from './cancellation_items';
export type { CommerceReturnItemsRow } from './return_items';
export type { CommerceOrderAllocationsRow } from './order_allocations';
