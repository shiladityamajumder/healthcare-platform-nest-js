/** Raw PostgreSQL row shape for `organization.memberships`. */
export interface OrganizationMembershipsRow {
  organization_id: string; // UUID
  user_id: string; // UUID
  location_id: string | null; // UUID
  department_id: string | null; // UUID
  employee_code: string | null; // VARCHAR(64)
  designation: string | null; // VARCHAR(128)
  manager_user_id: string | null; // UUID
  joined_at: string | null; // DATE
  left_at: string | null; // DATE
  status: string; // VARCHAR(16)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
