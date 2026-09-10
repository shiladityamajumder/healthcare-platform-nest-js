/** Raw PostgreSQL row shape for `catalog.products`. */
export interface CatalogProductsRow {
  sku: string; // VARCHAR(64)
  name: string; // VARCHAR(255)
  display_name: string | null; // VARCHAR(255)
  slug: string; // VARCHAR(255)
  brand_id: string | null; // UUID
  manufacturer_id: string | null; // UUID
  category_id: string | null; // UUID
  product_type: string; // VARCHAR(16)
  dosage_form_id: string | null; // UUID
  strength_display: string | null; // VARCHAR(128)
  pack_size_display: string | null; // VARCHAR(128)
  prescription_required: boolean; // BOOLEAN
  schedule_class: string | null; // VARCHAR(32)
  is_returnable: boolean; // BOOLEAN
  return_window_days: number | null; // INTEGER
  tax_code: string | null; // VARCHAR(64)
  hsn_code: string | null; // VARCHAR(32)
  status: string; // VARCHAR(16)
  published_at: Date | null; // TIMESTAMP WITH TIME ZONE
  discontinued_at: Date | null; // TIMESTAMP WITH TIME ZONE
  search_keywords: unknown; // JSONB
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
