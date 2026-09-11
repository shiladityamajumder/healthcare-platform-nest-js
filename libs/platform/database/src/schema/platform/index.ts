// * Linked with: ./outbox_events, ./inbox_messages, ./idempotency_keys.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the platform PostgreSQL schema. */
// * Describe the database row shape consumed by repositories and transaction code.
export type { PlatformOutboxEventsRow } from './outbox_events';
export type { PlatformInboxMessagesRow } from './inbox_messages';
export type { PlatformIdempotencyKeysRow } from './idempotency_keys';
export type { PlatformFeatureFlagsRow } from './feature_flags';
export type { PlatformApplicationSettingsRow } from './application_settings';
export type { PlatformDataRetentionPoliciesRow } from './data_retention_policies';
export type { PlatformWebhookEndpointsRow } from './webhook_endpoints';
export type { PlatformScheduledJobsRow } from './scheduled_jobs';
export type { PlatformAuditLogsRow } from './audit_logs';
export type { PlatformFileObjectsRow } from './file_objects';
export type { PlatformWebhookDeliveriesRow } from './webhook_deliveries';
export type { PlatformFileUploadSessionsRow } from './file_upload_sessions';
export type { PlatformFileVariantsRow } from './file_variants';
export type { PlatformFileAccessGrantsRow } from './file_access_grants';
export type { PlatformFileScanEventsRow } from './file_scan_events';
export type { PlatformFileAccessEventsRow } from './file_access_events';
