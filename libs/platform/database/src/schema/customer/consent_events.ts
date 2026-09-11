// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `customer.consent_events`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface CustomerConsentEventsRow {
  consent_id: string; // UUID
  event_type: string; // VARCHAR(32)
  actor_user_id: string | null; // UUID
  request_id: string | null; // UUID
  metadata_json: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
