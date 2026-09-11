// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `logistics.delivery_slots`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface LogisticsDeliverySlotsRow {
  postal_code: string; // VARCHAR(16)
  warehouse_id: string | null; // UUID
  service_date: string; // DATE
  slot_code: string; // VARCHAR(64)
  starts_at: Date; // TIMESTAMP WITH TIME ZONE
  ends_at: Date; // TIMESTAMP WITH TIME ZONE
  capacity: number; // INTEGER
  booked_count: number; // INTEGER
  fee: string; // NUMERIC(14, 2)
  status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  is_deleted: boolean; // BOOLEAN
  deleted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  deleted_by: string | null; // UUID
  row_version: string; // BIGINT
}
