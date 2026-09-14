// * Re-exports all typed PostgreSQL row shapes owned by the database platform.
// * Keeps schema imports centralized for repositories and other platform adapters.
// ! These types do not run migrations or change database objects.
/** Plain PostgreSQL row shapes for the externally managed healthcare database. */
export * from './identity';
export * from './organization';
export * from './customer';
export * from './catalog';
export * from './clinical';
export * from './appointment';
export * from './diagnostics';
export * from './pricing';
export * from './marketplace';
export * from './commerce';
export * from './payment';
export * from './finance';
export * from './insurance';
export * from './membership';
export * from './procurement';
export * from './warehouse';
export * from './fulfillment';
export * from './logistics';
export * from './notification';
export * from './support';
export * from './compliance';
export * from './risk';
export * from './platform';
export * from './search';
