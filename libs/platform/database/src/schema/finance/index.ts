// * Re-exports the typed PostgreSQL row shapes for the finance schema.
// * Used by repositories that need compile-time row types without ORM entities.
// ! These exports describe an existing database; they do not create or modify tables.
/** Row shapes for the finance PostgreSQL schema. */
export type { FinanceAccountsRow } from './accounts';
export type { FinanceJournalEntriesRow } from './journal_entries';
export type { FinanceJournalLinesRow } from './journal_lines';
export type { FinanceSettlementRunsRow } from './settlement_runs';
export type { FinanceInvoicesRow } from './invoices';
export type { FinanceSettlementItemsRow } from './settlement_items';
export type { FinanceInvoiceItemsRow } from './invoice_items';
export type { FinanceCreditNotesRow } from './credit_notes';
