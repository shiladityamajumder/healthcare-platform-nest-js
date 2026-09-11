// * Linked with: ./sla_policies, ./ticket_tags, ./tickets.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the support PostgreSQL schema. */
// * Describe the database row shape consumed by repositories and transaction code.
export type { SupportSlaPoliciesRow } from './sla_policies';
export type { SupportTicketTagsRow } from './ticket_tags';
export type { SupportTicketsRow } from './tickets';
export type { SupportTicketMessagesRow } from './ticket_messages';
export type { SupportTicketActionsRow } from './ticket_actions';
export type { SupportTicketStatusHistoryRow } from './ticket_status_history';
export type { SupportTicketTagAssignmentsRow } from './ticket_tag_assignments';
export type { SupportTicketAttachmentsRow } from './ticket_attachments';
