// * Re-exports the typed PostgreSQL row shapes for the appointment schema.
// * Used by repositories that need compile-time row types without ORM entities.
// ! These exports describe an existing database; they do not create or modify tables.
/** Row shapes for the appointment PostgreSQL schema. */
export type { AppointmentServiceTypesRow } from './service_types';
export type { AppointmentPractitionerServicesRow } from './practitioner_services';
export type { AppointmentAvailabilityRulesRow } from './availability_rules';
export type { AppointmentAvailabilityExceptionsRow } from './availability_exceptions';
export type { AppointmentAppointmentSlotsRow } from './appointment_slots';
export type { AppointmentAppointmentsRow } from './appointments';
export type { AppointmentAppointmentStatusHistoryRow } from './appointment_status_history';
export type { AppointmentTeleconsultationSessionsRow } from './teleconsultation_sessions';
export type { AppointmentWaitingRoomEventsRow } from './waiting_room_events';
