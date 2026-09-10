// Linked with: ./templates, ./provider_configurations, ./provider_webhooks.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the notification PostgreSQL schema. */
// Describe the database row shape consumed by repositories and transaction code.
export type { NotificationTemplatesRow } from './templates';
export type { NotificationProviderConfigurationsRow } from './provider_configurations';
export type { NotificationProviderWebhooksRow } from './provider_webhooks';
export type { NotificationSuppressionsRow } from './suppressions';
export type { NotificationMessagesRow } from './messages';
export type { NotificationDeviceEndpointsRow } from './device_endpoints';
export type { NotificationUserChannelPreferencesRow } from './user_channel_preferences';
export type { NotificationMessageAttachmentsRow } from './message_attachments';
export type { NotificationMessageAttemptsRow } from './message_attempts';
export type { NotificationInAppNotificationsRow } from './in_app_notifications';
