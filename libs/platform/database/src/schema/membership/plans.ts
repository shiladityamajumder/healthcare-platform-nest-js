/** Raw PostgreSQL row shape for `membership.plans`. */
export interface MembershipPlansRow {
  code: string; // VARCHAR(64)
  name: string; // VARCHAR(255)
  description: string | null; // TEXT
  price: string; // NUMERIC(14, 2)
  currency: string; // VARCHAR(3)
  duration_days: number; // INTEGER
  auto_renew_supported: boolean; // BOOLEAN
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
