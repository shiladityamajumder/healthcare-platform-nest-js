// * Re-exports the typed PostgreSQL row shapes for the notification schema.
// * Used by repositories that need compile-time row types without ORM entities.
// ! These exports describe an existing database; they do not create or modify tables.
/** Row shapes for the notification PostgreSQL schema. */
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
