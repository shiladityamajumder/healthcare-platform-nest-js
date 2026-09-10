// Linked with: ./service_types, ./practitioner_services, ./availability_rules.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the appointment PostgreSQL schema. */
// Describe the database row shape consumed by repositories and transaction code.
export type { AppointmentServiceTypesRow } from './service_types';
export type { AppointmentPractitionerServicesRow } from './practitioner_services';
export type { AppointmentAvailabilityRulesRow } from './availability_rules';
export type { AppointmentAvailabilityExceptionsRow } from './availability_exceptions';
export type { AppointmentAppointmentSlotsRow } from './appointment_slots';
export type { AppointmentAppointmentsRow } from './appointments';
export type { AppointmentAppointmentStatusHistoryRow } from './appointment_status_history';
export type { AppointmentTeleconsultationSessionsRow } from './teleconsultation_sessions';
export type { AppointmentWaitingRoomEventsRow } from './waiting_room_events';
