// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `payment.customer_payment_methods`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface PaymentCustomerPaymentMethodsRow {
  user_id: string; // UUID
  provider: string; // VARCHAR(64)
  method_type: string; // VARCHAR(32)
  provider_token: string; // VARCHAR(512)
  display_label: string | null; // VARCHAR(128)
  card_last4: string | null; // VARCHAR(4)
  card_network: string | null; // VARCHAR(32)
  expiry_month: number | null; // INTEGER
  expiry_year: number | null; // INTEGER
  is_default: boolean; // BOOLEAN
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
