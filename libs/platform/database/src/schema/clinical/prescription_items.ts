// * Describes the raw PostgreSQL row shape for the clinical.prescription_items table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `clinical.prescription_items`. */
export interface ClinicalPrescriptionItemsRow {
  prescription_id: string; // UUID
  product_id: string | null; // UUID
  medicine_name: string; // VARCHAR(255)
  strength: string | null; // VARCHAR(64)
  dosage: string | null; // VARCHAR(128)
  frequency: string | null; // VARCHAR(128)
  duration: string | null; // VARCHAR(128)
  route: string | null; // VARCHAR(64)
  quantity: string | null; // NUMERIC(12, 3)
  substitution_allowed: boolean | null; // BOOLEAN
  instructions: string | null; // TEXT
  review_status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
