// Linked with: ./practitioner_profiles, ./practitioner_organizations, ./patient_profiles.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the clinical PostgreSQL schema. */
// Describe the database row shape consumed by repositories and transaction code.
export type { ClinicalPractitionerProfilesRow } from './practitioner_profiles';
export type { ClinicalPractitionerOrganizationsRow } from './practitioner_organizations';
export type { ClinicalPatientProfilesRow } from './patient_profiles';
export type { ClinicalPatientAllergiesRow } from './patient_allergies';
export type { ClinicalPatientConditionsRow } from './patient_conditions';
export type { ClinicalCareEpisodesRow } from './care_episodes';
export type { ClinicalPatientMedicationsRow } from './patient_medications';
export type { ClinicalConsultationsRow } from './consultations';
export type { ClinicalDiagnosesRow } from './diagnoses';
export type { ClinicalObservationsRow } from './observations';
export type { ClinicalPrescriptionsRow } from './prescriptions';
export type { ClinicalPrescriptionDocumentsRow } from './prescription_documents';
export type { ClinicalPrescriptionItemsRow } from './prescription_items';
export type { ClinicalPrescriptionAccessLogsRow } from './prescription_access_logs';
