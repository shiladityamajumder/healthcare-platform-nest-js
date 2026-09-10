// Linked with: ./provider_accounts, ./payment_webhooks, ./customer_payment_methods.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the payment PostgreSQL schema. */
// Describe the database row shape consumed by repositories and transaction code.
export type { PaymentProviderAccountsRow } from './provider_accounts';
export type { PaymentPaymentWebhooksRow } from './payment_webhooks';
export type { PaymentCustomerPaymentMethodsRow } from './customer_payment_methods';
export type { PaymentReconciliationRunsRow } from './reconciliation_runs';
export type { PaymentReconciliationItemsRow } from './reconciliation_items';
export type { PaymentPaymentIntentsRow } from './payment_intents';
export type { PaymentPaymentAttemptsRow } from './payment_attempts';
export type { PaymentPaymentTransactionsRow } from './payment_transactions';
export type { PaymentRefundsRow } from './refunds';
export type { PaymentChargebacksRow } from './chargebacks';
export type { PaymentCodCollectionsRow } from './cod_collections';
