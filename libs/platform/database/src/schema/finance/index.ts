// Linked with: ./accounts, ./journal_entries, ./journal_lines.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the finance PostgreSQL schema. */
// Describe the database row shape consumed by repositories and transaction code.
export type { FinanceAccountsRow } from './accounts';
export type { FinanceJournalEntriesRow } from './journal_entries';
export type { FinanceJournalLinesRow } from './journal_lines';
export type { FinanceSettlementRunsRow } from './settlement_runs';
export type { FinanceInvoicesRow } from './invoices';
export type { FinanceSettlementItemsRow } from './settlement_items';
export type { FinanceInvoiceItemsRow } from './invoice_items';
export type { FinanceCreditNotesRow } from './credit_notes';
