// * Catalog module: Implements the PostgreSQL persistence adapter for catalog use cases.
// * File: src/infrastructure/persistence/catalog.repository.ts
// ? Keep SQL, table names, and row mapping inside the catalog infrastructure boundary.
// ! The physical database schema is externally managed; do not add migrations or alter models here.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PostgresDatabase } from '@platform/database';
import type {
  CreateProductInput,
  ProductListQuery,
  ProductRelationshipCreateInput,
  ProductSearchQuery,
  ReferenceListQuery,
  ReferenceResource,
  SubstitutionGroupCreateInput,
  SubstitutionGroupListQuery,
  SubstitutionGroupProductCreateInput,
} from '../../contracts/catalog.ports';
import type { CatalogRecord, ProductDetails } from '../../contracts/catalog.types';

type Row = Record<string, any>;

interface ReferenceDefinition {
  table: string;
  resourceType: string;
  columns: readonly string[];
  duplicateColumns: readonly string[];
  hasActive: boolean;
  allowedSort: Readonly<Record<string, string>>;
}

const REFERENCES: Record<ReferenceResource, ReferenceDefinition> = {
  brands: {
    table: 'catalog.brands',
    resourceType: 'brand',
    columns: ['name', 'slug', 'description', 'logo_file_id', 'owner_organization_id', 'is_active'],
    duplicateColumns: ['name', 'slug'],
    hasActive: true,
    allowedSort: { name: 'name', createdAt: 'created_at', updatedAt: 'updated_at' },
  },
  manufacturers: {
    table: 'catalog.manufacturers',
    resourceType: 'manufacturer',
    columns: [
      'organization_id',
      'name',
      'legal_name',
      'license_number',
      'country_code',
      'is_active',
    ],
    duplicateColumns: ['license_number'],
    hasActive: true,
    allowedSort: { name: 'name', createdAt: 'created_at', updatedAt: 'updated_at' },
  },
  categories: {
    table: 'catalog.categories',
    resourceType: 'category',
    columns: [
      'parent_id',
      'name',
      'slug',
      'path',
      'level',
      'display_order',
      'is_active',
      'metadata_json',
    ],
    duplicateColumns: ['slug'],
    hasActive: true,
    allowedSort: {
      name: 'name',
      displayOrder: 'display_order',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  salts: {
    table: 'catalog.salts',
    resourceType: 'salt',
    columns: ['name', 'normalized_name', 'description', 'standard_code'],
    duplicateColumns: ['normalized_name'],
    hasActive: false,
    allowedSort: { name: 'name', createdAt: 'created_at', updatedAt: 'updated_at' },
  },
  'dosage-forms': {
    table: 'catalog.dosage_forms',
    resourceType: 'dosageForm',
    columns: ['code', 'name', 'route_of_administration', 'is_active'],
    duplicateColumns: ['code'],
    hasActive: true,
    allowedSort: { name: 'name', code: 'code', createdAt: 'created_at', updatedAt: 'updated_at' },
  },
  units: {
    table: 'catalog.units_of_measure',
    resourceType: 'unit',
    columns: ['code', 'name', 'dimension', 'conversion_to_base'],
    duplicateColumns: ['code'],
    hasActive: false,
    allowedSort: { name: 'name', code: 'code', createdAt: 'created_at', updatedAt: 'updated_at' },
  },
};

const PRODUCT_SUMMARY = `
  SELECT p.id, p.sku, p.name, p.display_name, p.slug, p.product_type, p.status,
         p.brand_id, b.name AS brand_name,
         p.manufacturer_id, m.name AS manufacturer_name,
         p.category_id, c.name AS category_name,
         p.dosage_form_id, df.name AS dosage_form_name,
         p.prescription_required, 0::numeric AS available_quantity,
         p.created_at, p.updated_at, p.row_version
    FROM catalog.products p
    LEFT JOIN catalog.brands b ON b.id = p.brand_id AND b.is_deleted = false
    LEFT JOIN catalog.manufacturers m ON m.id = p.manufacturer_id AND m.is_deleted = false
    LEFT JOIN catalog.categories c ON c.id = p.category_id AND c.is_deleted = false
    LEFT JOIN catalog.dosage_forms df ON df.id = p.dosage_form_id AND df.is_deleted = false`;

@Injectable()
/** PostgreSQL repository for catalog products, references, and associations. */
export class CatalogRepository {
  public constructor(private readonly database: PostgresDatabase) {}

  /** Runs a catalog write workflow using the platform database transaction boundary. */
  transaction<T>(work: () => Promise<T>): Promise<T> {
    return this.database.transaction(() => work());
  }

  /** Builds a paginated product summary query for browsing and search. */
  async listProducts(query: ProductListQuery | ProductSearchQuery) {
    const values: unknown[] = [];
    const where = this.productFilters(query, values);
    if ('exactCodeMatch' in query && query.exactCodeMatch) {
      values.push(query.search.toUpperCase(), query.search.toLowerCase());
      where.push(`(p.sku = $${values.length - 1} OR p.slug = $${values.length}
        OR EXISTS (
          SELECT 1 FROM catalog.product_identifiers pi
          WHERE pi.product_id = p.id AND lower(pi.identifier_value) = $${values.length}
        ))`);
    } else if (query.search) {
      values.push(`%${query.search.trim()}%`);
      const index = values.length;
      where.push(`(
        p.name ILIKE $${index} OR COALESCE(p.display_name, '') ILIKE $${index}
        OR p.sku ILIKE $${index} OR p.slug ILIKE $${index}
        OR EXISTS (
          SELECT 1 FROM catalog.product_identifiers pi
          WHERE pi.product_id = p.id AND pi.identifier_value ILIKE $${index}
        )
        OR EXISTS (
          SELECT 1 FROM catalog.product_salts ps
          JOIN catalog.salts s ON s.id = ps.salt_id AND s.is_deleted = false
          WHERE ps.product_id = p.id AND s.name ILIKE $${index}
        )
        OR EXISTS (
          SELECT 1 FROM catalog.product_content pc
          WHERE pc.product_id = p.id AND pc.is_deleted = false
            AND (COALESCE(pc.title, '') ILIKE $${index} OR pc.body ILIKE $${index})
        )
        OR EXISTS (
          SELECT 1 FROM catalog.brands sb
          WHERE sb.id = p.brand_id AND sb.is_deleted = false AND sb.name ILIKE $${index}
        )
        OR EXISTS (
          SELECT 1 FROM catalog.manufacturers sm
          WHERE sm.id = p.manufacturer_id AND sm.is_deleted = false AND sm.name ILIKE $${index}
        )
        OR EXISTS (
          SELECT 1 FROM catalog.categories sc
          WHERE sc.id = p.category_id AND sc.is_deleted = false AND sc.name ILIKE $${index}
        )
      )`);
    }
    const totalValues = [...values];
    const sortMap: Record<string, string> = {
      createdAt: 'p.created_at',
      updatedAt: 'p.updated_at',
      name: 'p.name',
      sku: 'p.sku',
      status: 'p.status',
      productType: 'p.product_type',
    };
    const offset = (query.page - 1) * query.pageSize;
    values.push(query.pageSize, offset);
    const rows = await this.database.query<Row>(
      `${PRODUCT_SUMMARY} WHERE ${where.join(' AND ')}
       ORDER BY ${sortMap[query.sortBy] ?? 'p.created_at'} ${query.sortOrder === 'asc' ? 'ASC' : 'DESC'}, p.id
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM catalog.products p WHERE ${where.join(' AND ')}`,
      totalValues,
    );
    return { rows: rows.rows.map(mapProductSummary), total: Number(count.rows[0]?.total ?? 0) };
  }

  /** Reads a product row for application validation or transactional locking. */
  async getProductRow(id: string, includeDeleted = false, forUpdate = false): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM catalog.products WHERE id = $1 ${includeDeleted ? '' : 'AND is_deleted = false'} ${forUpdate ? 'FOR UPDATE' : ''}`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  /** Resolves a non-deleted product by SKU or slug. */
  async getProductByCode(value: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT id FROM catalog.products
       WHERE is_deleted = false AND (sku = $1 OR slug = $2) LIMIT 1`,
      [value.toUpperCase(), value.toLowerCase()],
    );
    return result.rows[0] ?? null;
  }

  /** Loads the product row and all active child collections for the aggregate response. */
  async getProductDetails(id: string, includeDeleted = false): Promise<ProductDetails | null> {
    const summary = await this.database.query<Row>(
      `${PRODUCT_SUMMARY} WHERE p.id = $1 ${includeDeleted ? '' : 'AND p.is_deleted = false'}`,
      [id],
    );
    if (!summary.rows[0]) return null;
    const product = await this.database.query<Row>('SELECT * FROM catalog.products WHERE id = $1', [
      id,
    ]);
    const [variants, identifiers, salts, attributes, content, media, regulatory] =
      await Promise.all([
        this.database.query<Row>(
          `SELECT id, variant_sku, name, strength_display, pack_quantity, pack_uom_id, status, is_default, row_version
           FROM catalog.product_variants WHERE product_id = $1 AND is_deleted = false
          ORDER BY is_default DESC, created_at, id`,
          [id],
        ),
        this.database.query<Row>(
          `SELECT id, variant_id, identifier_type, identifier_value, is_primary
           FROM catalog.product_identifiers WHERE product_id = $1
          ORDER BY is_primary DESC, created_at, id`,
          [id],
        ),
        this.database.query<Row>(
          `SELECT ps.id, ps.salt_id, s.name AS salt_name, ps.strength, ps.sequence
           FROM catalog.product_salts ps JOIN catalog.salts s ON s.id = ps.salt_id AND s.is_deleted = false
          WHERE ps.product_id = $1 ORDER BY ps.sequence, ps.id`,
          [id],
        ),
        this.database.query<Row>(
          `SELECT id, attribute_key, attribute_value, is_filterable
           FROM catalog.product_attributes WHERE product_id = $1 ORDER BY attribute_key, id`,
          [id],
        ),
        this.database.query<Row>(
          `SELECT id, locale, content_type, title, body, structured_content
           FROM catalog.product_content WHERE product_id = $1 AND is_deleted = false
          ORDER BY locale, content_type, id`,
          [id],
        ),
        this.database.query<Row>(
          `SELECT id, variant_id, media_type, file_object_id, alt_text, display_order, is_primary
           FROM catalog.product_media WHERE product_id = $1 AND is_deleted = false
          ORDER BY display_order, id`,
          [id],
        ),
        this.database.query<Row>(
          `SELECT id, drug_license_category, storage_conditions, controlled_substance,
                max_order_quantity, requires_cold_chain, requires_age_verification,
                narcotic_register_required, regulatory_metadata
           FROM catalog.product_regulatory
          WHERE product_id = $1 AND is_deleted = false LIMIT 1`,
          [id],
        ),
      ]);
    return {
      ...mapProductSummary(summary.rows[0]),
      ...toCamelRow(product.rows[0]),
      rowVersion: Number(product.rows[0].row_version),
      variants: variants.rows.map(toCamelRowWithVersion),
      identifiers: identifiers.rows.map(toCamelRow),
      salts: salts.rows.map(toCamelRow),
      attributes: attributes.rows.map(toCamelRow),
      content: content.rows.map(toCamelRow),
      media: media.rows.map(toCamelRow),
      regulatory: regulatory.rows[0] ? toCamelRow(regulatory.rows[0]) : null,
    } as ProductDetails;
  }

  async productDuplicate(
    sku: string | null,
    slug: string | null,
    excludeId?: string,
  ): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.products
        WHERE is_deleted = false AND ($1::text IS NOT NULL AND sku = $1 OR $2::text IS NOT NULL AND slug = $2)
          AND ($3::uuid IS NULL OR id <> $3) LIMIT 1`,
      [sku, slug, excludeId ?? null],
    );
    return Boolean(result.rowCount);
  }

  async referenceExists(table: string, id: string, requiresActive = false): Promise<boolean> {
    const allowed: Record<string, string> = {
      brands: 'catalog.brands',
      manufacturers: 'catalog.manufacturers',
      categories: 'catalog.categories',
      dosageForms: 'catalog.dosage_forms',
      salts: 'catalog.salts',
      units: 'catalog.units_of_measure',
      files: 'platform.file_objects',
    };
    const target = allowed[table];
    if (!target) return false;
    const hasSoftDelete = table !== 'files';
    const result = await this.database.query(
      `SELECT 1 FROM ${target} WHERE id = $1 ${hasSoftDelete ? 'AND is_deleted = false' : ''} ${requiresActive ? 'AND is_active = true' : ''} LIMIT 1`,
      [id],
    );
    return Boolean(result.rowCount);
  }

  async identifierExists(type: string, value: string, excludeProductId?: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.product_identifiers
       WHERE identifier_type = $1 AND identifier_value = $2
         AND ($3::uuid IS NULL OR product_id <> $3) LIMIT 1`,
      [type, value, excludeProductId ?? null],
    );
    return Boolean(result.rowCount);
  }

  async variantSkuExists(sku: string, excludeProductId?: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.product_variants
       WHERE variant_sku = $1 AND is_deleted = false
         AND ($2::uuid IS NULL OR product_id <> $2) LIMIT 1`,
      [sku, excludeProductId ?? null],
    );
    return Boolean(result.rowCount);
  }

  async variantMatches(variantId: string, productId: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.product_variants
       WHERE id = $1 AND product_id = $2 AND is_deleted = false LIMIT 1`,
      [variantId, productId],
    );
    return Boolean(result.rowCount);
  }

  /** Checks for duplicate directed product relationships before insertion or update. */
  async productRelationshipExists(
    sourceProductId: string,
    targetProductId: string,
    relationshipType: string,
    excludeId?: string,
  ): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.product_relationships
       WHERE source_product_id = $1 AND target_product_id = $2 AND relationship_type = $3
         AND ($4::uuid IS NULL OR id <> $4) LIMIT 1`,
      [sourceProductId, targetProductId, relationshipType, excludeId ?? null],
    );
    return Boolean(result.rowCount);
  }

  async listProductRelationships(productId: string, relationshipType?: string) {
    const values: unknown[] = [productId];
    const typeFilter = relationshipType ? 'AND pr.relationship_type = $2' : '';
    if (relationshipType) values.push(relationshipType);
    const result = await this.database.query<Row>(
      `SELECT pr.id, pr.source_product_id, sp.sku AS source_sku, sp.name AS source_name,
              pr.target_product_id, tp.sku AS target_sku, tp.name AS target_name,
              pr.relationship_type, pr.priority, pr.metadata_json, pr.created_at,
              pr.updated_at, pr.row_version
         FROM catalog.product_relationships pr
         JOIN catalog.products sp ON sp.id = pr.source_product_id AND sp.is_deleted = false
         JOIN catalog.products tp ON tp.id = pr.target_product_id AND tp.is_deleted = false
        WHERE pr.source_product_id = $1 ${typeFilter}
        ORDER BY pr.priority, pr.created_at, pr.id`,
      values,
    );
    return result.rows.map(toCamelRowWithVersion);
  }

  async getProductRelationship(
    productId: string,
    relationshipId: string,
    forUpdate = false,
  ): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM catalog.product_relationships
       WHERE id = $1 AND source_product_id = $2 ${forUpdate ? 'FOR UPDATE' : ''}`,
      [relationshipId, productId],
    );
    return result.rows[0] ?? null;
  }

  async createProductRelationship(
    productId: string,
    input: ProductRelationshipCreateInput,
    actor: string | null,
  ): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO catalog.product_relationships
        (source_product_id, target_product_id, relationship_type, priority, metadata_json, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5::jsonb,$6,$6) RETURNING *`,
      [
        productId,
        input.targetProductId,
        input.relationshipType,
        input.priority,
        JSON.stringify(input.metadataJson ?? {}),
        actor,
      ],
    );
    return result.rows[0];
  }

  async updateProductRelationship(
    productId: string,
    relationshipId: string,
    values: Row,
    actor: string | null,
    expectedRowVersion?: number,
  ): Promise<Row | null> {
    const columns: Record<string, string> = {
      targetProductId: 'target_product_id',
      relationshipType: 'relationship_type',
      priority: 'priority',
      metadataJson: 'metadata_json',
    };
    const entries = Object.entries(values).filter(([key]) => columns[key]);
    const params = entries.map(([key, value]) =>
      key === 'metadataJson' ? JSON.stringify(value) : value,
    );
    const assignments = entries.map(
      ([key], index) => `${columns[key]} = $${index + 1}${key === 'metadataJson' ? '::jsonb' : ''}`,
    );
    const actorIndex = params.length + 1;
    params.push(actor);
    const versionIndex = expectedRowVersion === undefined ? undefined : params.length + 1;
    if (expectedRowVersion !== undefined) params.push(expectedRowVersion);
    params.push(relationshipId, productId);
    const relationshipIndex = params.length - 1;
    const productIndex = params.length;
    const result = await this.database.query<Row>(
      `UPDATE catalog.product_relationships
          SET ${assignments.join(', ')}, updated_by = $${actorIndex}, updated_at = now(), row_version = row_version + 1
        WHERE id = $${relationshipIndex} AND source_product_id = $${productIndex}
          ${versionIndex === undefined ? '' : `AND row_version = $${versionIndex}`}
        RETURNING *`,
      params,
    );
    return result.rows[0] ?? null;
  }

  async deleteProductRelationship(productId: string, relationshipId: string): Promise<boolean> {
    const result = await this.database.query(
      `DELETE FROM catalog.product_relationships WHERE id = $1 AND source_product_id = $2`,
      [relationshipId, productId],
    );
    return Boolean(result.rowCount);
  }

  /** Lists substitution-group signatures with optional reference filters. */
  async listSubstitutionGroups(query: SubstitutionGroupListQuery) {
    const values: unknown[] = [];
    const where = ['1 = 1'];
    if (!query.includeDeleted) where.push('sg.is_deleted = false');
    if (query.isActive !== undefined) {
      values.push(query.isActive);
      where.push(`sg.is_active = $${values.length}`);
    }
    if (query.dosageFormId) {
      values.push(query.dosageFormId);
      where.push(`sg.dosage_form_id = $${values.length}`);
    }
    if (query.search) {
      values.push(`%${query.search.trim()}%`);
      where.push(
        `(sg.salt_signature ILIKE $${values.length} OR sg.strength_signature ILIKE $${values.length})`,
      );
    }
    const totalValues = [...values];
    const sortMap: Record<string, string> = {
      name: 'sg.salt_signature',
      createdAt: 'sg.created_at',
      updatedAt: 'sg.updated_at',
    };
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT sg.*, df.name AS dosage_form_name
         FROM catalog.substitution_groups sg
         LEFT JOIN catalog.dosage_forms df ON df.id = sg.dosage_form_id AND df.is_deleted = false
        WHERE ${where.join(' AND ')}
        ORDER BY ${sortMap[query.sortBy] ?? 'sg.created_at'} ${query.sortOrder === 'asc' ? 'ASC' : 'DESC'}, sg.id
        LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM catalog.substitution_groups sg WHERE ${where.join(' AND ')}`,
      totalValues,
    );
    return { rows: rows.rows.map(toCamelRowWithVersion), total: Number(count.rows[0]?.total ?? 0) };
  }

  async getSubstitutionGroup(
    id: string,
    includeDeleted = false,
    forUpdate = false,
  ): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT sg.*, df.name AS dosage_form_name
         FROM catalog.substitution_groups sg
         LEFT JOIN catalog.dosage_forms df ON df.id = sg.dosage_form_id AND df.is_deleted = false
        WHERE sg.id = $1 ${includeDeleted ? '' : 'AND sg.is_deleted = false'} ${forUpdate ? 'FOR UPDATE OF sg' : ''}`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  async substitutionGroupDuplicate(
    saltSignature: string,
    dosageFormId?: string | null,
    strengthSignature?: string | null,
    excludeId?: string,
  ): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.substitution_groups
       WHERE is_deleted = false AND salt_signature = $1
         AND dosage_form_id IS NOT DISTINCT FROM $2::uuid
         AND strength_signature IS NOT DISTINCT FROM $3::text
         AND ($4::uuid IS NULL OR id <> $4) LIMIT 1`,
      [saltSignature, dosageFormId ?? null, strengthSignature ?? null, excludeId ?? null],
    );
    return Boolean(result.rowCount);
  }

  async createSubstitutionGroup(
    input: SubstitutionGroupCreateInput,
    actor: string | null,
  ): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO catalog.substitution_groups
        (salt_signature, dosage_form_id, strength_signature, is_active, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$5) RETURNING *`,
      [
        input.saltSignature,
        input.dosageFormId ?? null,
        input.strengthSignature ?? null,
        input.isActive,
        actor,
      ],
    );
    return result.rows[0];
  }

  async updateSubstitutionGroup(
    id: string,
    values: Row,
    actor: string | null,
    expectedRowVersion?: number,
  ): Promise<Row | null> {
    const columns: Record<string, string> = {
      saltSignature: 'salt_signature',
      dosageFormId: 'dosage_form_id',
      strengthSignature: 'strength_signature',
      isActive: 'is_active',
    };
    const entries = Object.entries(values).filter(([key]) => columns[key]);
    const params = entries.map(([, value]) => value);
    const assignments = entries.map(([key], index) => `${columns[key]} = $${index + 1}`);
    const actorIndex = params.length + 1;
    params.push(actor);
    const versionIndex = expectedRowVersion === undefined ? undefined : params.length + 1;
    if (expectedRowVersion !== undefined) params.push(expectedRowVersion);
    const idIndex = params.length + 1;
    params.push(id);
    const result = await this.database.query<Row>(
      `UPDATE catalog.substitution_groups
          SET ${assignments.join(', ')}, updated_by = $${actorIndex}, updated_at = now(), row_version = row_version + 1
        WHERE id = $${idIndex} AND is_deleted = false
          ${versionIndex === undefined ? '' : `AND row_version = $${versionIndex}`}
        RETURNING *`,
      params,
    );
    return result.rows[0] ?? null;
  }

  async deactivateSubstitutionGroup(id: string, actor: string | null): Promise<boolean> {
    const result = await this.database.query(
      `UPDATE catalog.substitution_groups
          SET is_active = false, is_deleted = true, deleted_at = now(), deleted_by = $2,
              updated_by = $2, updated_at = now(), row_version = row_version + 1
        WHERE id = $1 AND is_deleted = false`,
      [id, actor],
    );
    return Boolean(result.rowCount);
  }

  async reactivateSubstitutionGroup(id: string, actor: string | null): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE catalog.substitution_groups
          SET is_active = true, is_deleted = false, deleted_at = NULL, deleted_by = NULL,
              updated_by = $2, updated_at = now(), row_version = row_version + 1
        WHERE id = $1 AND is_deleted = true RETURNING *`,
      [id, actor],
    );
    return result.rows[0] ?? null;
  }

  /** Lists products assigned to a substitution group in configured priority order. */
  async listSubstitutionGroupProducts(groupId: string) {
    const result = await this.database.query<Row>(
      `SELECT sgp.id, sgp.group_id, sgp.product_id, p.sku, p.name, p.display_name,
              p.product_type, p.status, p.prescription_required, sgp.priority,
              sgp.created_at, sgp.updated_at, sgp.row_version
         FROM catalog.substitution_group_products sgp
         JOIN catalog.products p ON p.id = sgp.product_id AND p.is_deleted = false
        WHERE sgp.group_id = $1 ORDER BY sgp.priority, sgp.created_at, sgp.id`,
      [groupId],
    );
    return result.rows.map(toCamelRowWithVersion);
  }

  async listProductSubstitutionGroups(productId: string) {
    const result = await this.database.query<Row>(
      `SELECT sg.id, sg.salt_signature, sg.dosage_form_id, sg.strength_signature,
              sg.is_active, sgp.priority AS product_priority, sg.created_at, sg.updated_at,
              sg.row_version
         FROM catalog.substitution_group_products sgp
         JOIN catalog.substitution_groups sg ON sg.id = sgp.group_id AND sg.is_deleted = false
        WHERE sgp.product_id = $1 ORDER BY sgp.priority, sg.created_at, sg.id`,
      [productId],
    );
    return result.rows.map(toCamelRowWithVersion);
  }

  async substitutionGroupProductExists(groupId: string, productId: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.substitution_group_products WHERE group_id = $1 AND product_id = $2 LIMIT 1`,
      [groupId, productId],
    );
    return Boolean(result.rowCount);
  }

  async addSubstitutionGroupProduct(
    groupId: string,
    input: SubstitutionGroupProductCreateInput,
    actor: string | null,
  ): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO catalog.substitution_group_products
        (group_id, product_id, priority, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$4) RETURNING *`,
      [groupId, input.productId, input.priority, actor],
    );
    return result.rows[0];
  }

  async updateSubstitutionGroupProduct(
    groupId: string,
    productId: string,
    values: Row,
    actor: string | null,
    expectedRowVersion?: number,
  ): Promise<Row | null> {
    const params: unknown[] = [values.priority, actor];
    let versionClause = '';
    if (expectedRowVersion !== undefined) {
      params.push(expectedRowVersion);
      versionClause = ` AND row_version = $${params.length}`;
    }
    params.push(groupId, productId);
    const result = await this.database.query<Row>(
      `UPDATE catalog.substitution_group_products
          SET priority = $1, updated_by = $2, updated_at = now(), row_version = row_version + 1
        WHERE group_id = $${params.length - 1} AND product_id = $${params.length}${versionClause}
        RETURNING *`,
      params,
    );
    return result.rows[0] ?? null;
  }

  async removeSubstitutionGroupProduct(groupId: string, productId: string): Promise<boolean> {
    const result = await this.database.query(
      `DELETE FROM catalog.substitution_group_products WHERE group_id = $1 AND product_id = $2`,
      [groupId, productId],
    );
    return Boolean(result.rowCount);
  }

  /** Inserts the product master row using the externally managed catalog table. */
  async createProduct(
    input: CreateProductInput,
    slug: string,
    actor: string | null,
  ): Promise<string> {
    const result = await this.database.query<{ id: string }>(
      `INSERT INTO catalog.products (
         sku, name, display_name, slug, brand_id, manufacturer_id, category_id, product_type,
         dosage_form_id, strength_display, pack_size_display, prescription_required, schedule_class,
         is_returnable, return_window_days, tax_code, hsn_code, status, published_at,
         search_keywords, created_by, updated_by
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
         CASE WHEN $18 = 'active' THEN now() ELSE NULL END,$19::jsonb,$20,$20
       ) RETURNING id`,
      [
        input.sku.trim().toUpperCase(),
        input.name.trim(),
        input.displayName ?? null,
        slug,
        input.brandId ?? null,
        input.manufacturerId ?? null,
        input.categoryId ?? null,
        input.productType,
        input.dosageFormId ?? null,
        input.strengthDisplay ?? null,
        input.packSizeDisplay ?? null,
        input.prescriptionRequired,
        input.scheduleClass ?? null,
        input.isReturnable,
        input.returnWindowDays ?? null,
        input.taxCode ?? null,
        input.hsnCode ?? null,
        input.status,
        JSON.stringify(normalizeKeywords(input.searchKeywords)),
        actor,
      ],
    );
    return result.rows[0].id;
  }

  /** Inserts product variant child rows. */
  async insertVariants(
    productId: string,
    items: readonly Row[],
    actor: string | null,
  ): Promise<void> {
    for (const item of items) {
      await this.database.query(
        `INSERT INTO catalog.product_variants
          (product_id, variant_sku, name, strength_display, pack_quantity, pack_uom_id, status, is_default, created_by, updated_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9)`,
        [
          productId,
          item.variantSku,
          item.name,
          item.strengthDisplay ?? null,
          item.packQuantity,
          item.packUomId ?? null,
          item.status ?? 'draft',
          item.isDefault ?? false,
          actor,
        ],
      );
    }
  }

  /** Inserts product identifier and barcode child rows. */
  async insertIdentifiers(
    productId: string,
    items: readonly Row[],
    actor: string | null,
  ): Promise<void> {
    for (const item of items)
      await this.database.query(
        `INSERT INTO catalog.product_identifiers
        (product_id, variant_id, identifier_type, identifier_value, is_primary, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$6)`,
        [
          productId,
          item.variantId ?? null,
          item.identifierType,
          item.identifierValue,
          item.isPrimary ?? false,
          actor,
        ],
      );
  }

  async insertSalts(productId: string, items: readonly Row[], actor: string | null): Promise<void> {
    for (const item of items)
      await this.database.query(
        `INSERT INTO catalog.product_salts
        (product_id, salt_id, strength, sequence, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$5)`,
        [productId, item.saltId, item.strength ?? null, item.sequence ?? 1, actor],
      );
  }

  async insertAttributes(
    productId: string,
    items: readonly Row[],
    actor: string | null,
  ): Promise<void> {
    for (const item of items)
      await this.database.query(
        `INSERT INTO catalog.product_attributes
        (product_id, attribute_key, attribute_value, is_filterable, created_by, updated_by)
       VALUES ($1,$2,$3::jsonb,$4,$5,$5)`,
        [
          productId,
          item.attributeKey,
          JSON.stringify(item.attributeValue),
          item.isFilterable ?? false,
          actor,
        ],
      );
  }

  async insertContent(
    productId: string,
    items: readonly Row[],
    actor: string | null,
  ): Promise<void> {
    for (const item of items)
      await this.database.query(
        `INSERT INTO catalog.product_content
        (product_id, locale, content_type, title, body, structured_content, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$7)`,
        [
          productId,
          item.locale ?? 'en-IN',
          item.contentType,
          item.title ?? null,
          item.body,
          JSON.stringify(item.structuredContent ?? {}),
          actor,
        ],
      );
  }

  async insertMedia(productId: string, items: readonly Row[], actor: string | null): Promise<void> {
    for (const item of items)
      await this.database.query(
        `INSERT INTO catalog.product_media
        (product_id, variant_id, media_type, file_object_id, alt_text, display_order, is_primary, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8)`,
        [
          productId,
          item.variantId ?? null,
          item.mediaType,
          item.fileObjectId,
          item.altText ?? null,
          item.displayOrder ?? 0,
          item.isPrimary ?? false,
          actor,
        ],
      );
  }

  async insertRegulatory(productId: string, item: Row, actor: string | null): Promise<void> {
    await this.database.query(
      `INSERT INTO catalog.product_regulatory
        (product_id, drug_license_category, storage_conditions, controlled_substance,
         max_order_quantity, requires_cold_chain, requires_age_verification,
         narcotic_register_required, regulatory_metadata, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$10)`,
      [
        productId,
        item.drugLicenseCategory ?? null,
        item.storageConditions ?? null,
        item.controlledSubstance ?? false,
        item.maxOrderQuantity ?? null,
        item.requiresColdChain ?? false,
        item.requiresAgeVerification ?? false,
        item.narcoticRegisterRequired ?? false,
        JSON.stringify(item.regulatoryMetadata ?? {}),
        actor,
      ],
    );
  }

  async updateProduct(
    id: string,
    values: Row,
    actor: string | null,
    expectedRowVersion?: number,
  ): Promise<boolean> {
    const columns: Record<string, string> = {
      name: 'name',
      displayName: 'display_name',
      slug: 'slug',
      brandId: 'brand_id',
      manufacturerId: 'manufacturer_id',
      categoryId: 'category_id',
      dosageFormId: 'dosage_form_id',
      strengthDisplay: 'strength_display',
      packSizeDisplay: 'pack_size_display',
      prescriptionRequired: 'prescription_required',
      scheduleClass: 'schedule_class',
      isReturnable: 'is_returnable',
      returnWindowDays: 'return_window_days',
      taxCode: 'tax_code',
      hsnCode: 'hsn_code',
      status: 'status',
      searchKeywords: 'search_keywords',
      publishedAt: 'published_at',
      discontinuedAt: 'discontinued_at',
    };
    const entries = Object.entries(values).filter(([key]) => columns[key]);
    const params = entries.map(([key, value]) =>
      key === 'searchKeywords' ? JSON.stringify(value) : value,
    );
    const assignments = entries.map(
      ([key], index) =>
        `${columns[key]} = $${index + 1}${key === 'searchKeywords' ? '::jsonb' : ''}`,
    );
    const actorIndex = params.length + 1;
    params.push(actor);
    const versionIndex = expectedRowVersion === undefined ? undefined : params.length + 1;
    if (expectedRowVersion !== undefined) params.push(expectedRowVersion);
    const idIndex = params.length + 1;
    params.push(id);
    const versionClause =
      versionIndex === undefined
        ? `id = $${idIndex}`
        : `id = $${idIndex} AND row_version = $${versionIndex}`;
    const result = await this.database.query(
      `UPDATE catalog.products SET ${assignments.length ? `${assignments.join(', ')},` : ''} updated_by = $${actorIndex},
              updated_at = now(), row_version = row_version + 1
        WHERE ${versionClause}`,
      params,
    );
    return Boolean(result.rowCount);
  }

  /** Replaces non-soft-deleted child collections such as identifiers and salts. */
  async replaceSimpleChildren(
    productId: string,
    kind: 'identifiers' | 'salts' | 'attributes',
    items: readonly Row[],
    actor: string | null,
  ): Promise<void> {
    const tables = {
      identifiers: 'catalog.product_identifiers',
      salts: 'catalog.product_salts',
      attributes: 'catalog.product_attributes',
    };
    await this.database.query(`DELETE FROM ${tables[kind]} WHERE product_id = $1`, [productId]);
    if (kind === 'identifiers') await this.insertIdentifiers(productId, items, actor);
    if (kind === 'salts') await this.insertSalts(productId, items, actor);
    if (kind === 'attributes') await this.insertAttributes(productId, items, actor);
  }

  /** Soft-deletes and reinserts versioned child collections. */
  async replaceSoftDeletedChildren(
    productId: string,
    kind: 'variants' | 'media' | 'regulatory',
    items: readonly Row[],
    actor: string | null,
  ): Promise<void> {
    const tables = {
      variants: 'catalog.product_variants',
      media: 'catalog.product_media',
      regulatory: 'catalog.product_regulatory',
    };
    await this.database.query(
      `UPDATE ${tables[kind]} SET is_deleted = true, deleted_at = now(), deleted_by = $2,
              updated_by = $2, updated_at = now(), row_version = row_version + 1
        WHERE product_id = $1 AND is_deleted = false`,
      [productId, actor],
    );
    if (kind === 'variants') await this.insertVariants(productId, items, actor);
    if (kind === 'media') await this.insertMedia(productId, items, actor);
    if (kind === 'regulatory' && items[0]) await this.insertRegulatory(productId, items[0], actor);
  }

  /** Replaces localized content while preserving the content history contract. */
  async replaceContent(
    productId: string,
    items: readonly Row[],
    actor: string | null,
  ): Promise<void> {
    await this.database.query(
      `UPDATE catalog.product_content SET is_deleted = true, deleted_at = now(), deleted_by = $2,
              updated_by = $2, updated_at = now(), row_version = row_version + 1
        WHERE product_id = $1 AND is_deleted = false`,
      [productId, actor],
    );
    for (const item of items) {
      await this.database.query(
        `INSERT INTO catalog.product_content
          (product_id, locale, content_type, title, body, structured_content, created_by, updated_by)
         VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$7)
         ON CONFLICT (product_id, locale, content_type) DO UPDATE SET
           title = EXCLUDED.title, body = EXCLUDED.body, structured_content = EXCLUDED.structured_content,
           is_deleted = false, deleted_at = NULL, deleted_by = NULL, updated_by = EXCLUDED.updated_by,
           updated_at = now(), row_version = catalog.product_content.row_version + 1`,
        [
          productId,
          item.locale ?? 'en-IN',
          item.contentType,
          item.title ?? null,
          item.body,
          JSON.stringify(item.structuredContent ?? {}),
          actor,
        ],
      );
    }
  }

  async deactivateProduct(id: string, actor: string | null): Promise<boolean> {
    const result = await this.database.query(
      `UPDATE catalog.products SET status = 'inactive', is_deleted = true, deleted_at = now(),
              deleted_by = $2, updated_by = $2, updated_at = now(), row_version = row_version + 1
        WHERE id = $1 AND is_deleted = false`,
      [id, actor],
    );
    return Boolean(result.rowCount);
  }

  async reactivateProduct(id: string, actor: string | null): Promise<void> {
    await this.database.query(
      `UPDATE catalog.products SET status = 'inactive', is_deleted = false, deleted_at = NULL,
              deleted_by = NULL, updated_by = $2, updated_at = now(), row_version = row_version + 1
        WHERE id = $1`,
      [id, actor],
    );
  }

  async listProductRowsForUpdate(ids: readonly string[]): Promise<Row[]> {
    const result = await this.database.query<Row>(
      `SELECT * FROM catalog.products WHERE id = ANY($1::uuid[]) AND is_deleted = false ORDER BY id FOR UPDATE`,
      [ids],
    );
    return result.rows;
  }

  async updateProductStatus(
    id: string,
    status: string,
    actor: string | null,
    current: string,
  ): Promise<void> {
    await this.database.query(
      `UPDATE catalog.products SET status = $2,
          published_at = CASE WHEN $2 = 'active' AND published_at IS NULL THEN now() ELSE published_at END,
          discontinued_at = CASE WHEN $2 = 'discontinued' THEN now() WHEN $3 = 'discontinued' THEN NULL ELSE discontinued_at END,
          updated_by = $4, updated_at = now(), row_version = row_version + 1 WHERE id = $1`,
      [id, status, current, actor],
    );
  }

  /** Lists a configured reference resource using its safe table definition. */
  async listReferences(resource: ReferenceResource, query: ReferenceListQuery) {
    const def = REFERENCES[resource];
    const values: unknown[] = [];
    const where = ['1 = 1'];
    if (!query.includeDeleted) where.push('is_deleted = false');
    if (query.search) {
      values.push(`%${query.search.trim()}%`);
      where.push(`name ILIKE $${values.length}`);
    }
    if (query.isActive !== undefined && def.hasActive) {
      values.push(query.isActive);
      where.push(`is_active = $${values.length}`);
    }
    const totalValues = [...values];
    const offset = (query.page - 1) * query.pageSize;
    values.push(query.pageSize, offset);
    const sort = def.allowedSort[query.sortBy] ?? def.allowedSort.name;
    const rows = await this.database.query<Row>(
      `SELECT * FROM ${def.table} WHERE ${where.join(' AND ')}
       ORDER BY ${sort} ${query.sortOrder === 'desc' ? 'DESC' : 'ASC'}, id
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM ${def.table} WHERE ${where.join(' AND ')}`,
      totalValues,
    );
    return {
      rows: rows.rows.map((row) => mapReference(row, def)),
      total: Number(count.rows[0]?.total ?? 0),
    };
  }

  async getReference(
    resource: ReferenceResource,
    id: string,
    includeDeleted = false,
    forUpdate = false,
  ): Promise<Row | null> {
    const def = REFERENCES[resource];
    const result = await this.database.query<Row>(
      `SELECT * FROM ${def.table} WHERE id = $1 ${includeDeleted ? '' : 'AND is_deleted = false'} ${forUpdate ? 'FOR UPDATE' : ''}`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  async referenceDuplicate(
    resource: ReferenceResource,
    column: string,
    value: unknown,
    excludeId?: string,
  ): Promise<boolean> {
    const def = REFERENCES[resource];
    if (!def.duplicateColumns.includes(column)) return false;
    const result = await this.database.query(
      `SELECT 1 FROM ${def.table} WHERE is_deleted = false AND lower(${column}::text) = lower($1::text)
        AND ($2::uuid IS NULL OR id <> $2) LIMIT 1`,
      [value, excludeId ?? null],
    );
    return Boolean(result.rowCount);
  }

  async createReference(
    resource: ReferenceResource,
    values: Row,
    actor: string | null,
  ): Promise<Row> {
    const def = REFERENCES[resource];
    const entries = Object.entries(values).filter(([key]) => def.columns.includes(key));
    const params = entries.map(([, value]) => keyJson(value));
    params.push(actor);
    const columns = entries.map(([key]) => key);
    const placeholders = entries.map(
      ([key], index) => `$${index + 1}${key.endsWith('_json') ? '::jsonb' : ''}`,
    );
    const result = await this.database.query<Row>(
      `INSERT INTO ${def.table} (${columns.join(', ')}, created_by, updated_by)
       VALUES (${placeholders.join(', ')}, $${params.length}, $${params.length}) RETURNING *`,
      params,
    );
    return result.rows[0];
  }

  async updateReference(
    resource: ReferenceResource,
    id: string,
    values: Row,
    actor: string | null,
  ): Promise<Row | null> {
    const def = REFERENCES[resource];
    const entries = Object.entries(values).filter(([key]) => def.columns.includes(key));
    const params = entries.map(([, value]) => keyJson(value));
    const sets = entries.map(
      ([key], index) => `${key} = $${index + 1}${key.endsWith('_json') ? '::jsonb' : ''}`,
    );
    params.push(actor, id);
    const result = await this.database.query<Row>(
      `UPDATE ${def.table} SET ${sets.join(', ')}, updated_by = $${params.length - 1},
              updated_at = now(), row_version = row_version + 1
        WHERE id = $${params.length} AND is_deleted = false RETURNING *`,
      params,
    );
    return result.rows[0] ?? null;
  }

  async deactivateReference(
    resource: ReferenceResource,
    id: string,
    actor: string | null,
  ): Promise<boolean> {
    const def = REFERENCES[resource];
    const result = await this.database.query(
      `UPDATE ${def.table} SET ${def.hasActive ? 'is_active = false,' : ''}
              is_deleted = true, deleted_at = now(), deleted_by = $2, updated_by = $2,
              updated_at = now(), row_version = row_version + 1
        WHERE id = $1 AND is_deleted = false`,
      [id, actor],
    );
    return Boolean(result.rowCount);
  }

  async reactivateReference(
    resource: ReferenceResource,
    id: string,
    actor: string | null,
  ): Promise<Row | null> {
    const def = REFERENCES[resource];
    const result = await this.database.query<Row>(
      `UPDATE ${def.table} SET ${def.hasActive ? 'is_active = true,' : ''}
              is_deleted = false, deleted_at = NULL, deleted_by = NULL, updated_by = $2,
              updated_at = now(), row_version = row_version + 1 WHERE id = $1 RETURNING *`,
      [id, actor],
    );
    return result.rows[0] ?? null;
  }

  /** Reads category descendants for hierarchy validation and locking. */
  async categoryDescendants(path: string, forUpdate = false): Promise<Row[]> {
    const result = await this.database.query<Row>(
      `SELECT * FROM catalog.categories WHERE path LIKE $1 AND path <> $2 ORDER BY level, display_order, id ${forUpdate ? 'FOR UPDATE' : ''}`,
      [`${path}/%`, path],
    );
    return result.rows;
  }

  /** Reads category rows used to build the public tree response. */
  async categoryTreeRows(): Promise<Row[]> {
    const result = await this.database.query<Row>(
      `SELECT * FROM catalog.categories WHERE is_deleted = false ORDER BY level, display_order, name, id`,
    );
    return result.rows;
  }

  async updateCategoryHierarchy(
    id: string,
    oldPath: string,
    newPath: string,
    levelDelta: number,
    values: Row,
    actor: string | null,
  ): Promise<Row> {
    const current = await this.getReference('categories', id, false, true);
    if (!current) throw new Error('Category disappeared while locked.');
    const update = await this.updateReference('categories', id, values, actor);
    await this.database.query(
      `UPDATE catalog.categories SET path = $2 || substring(path FROM char_length($1) + 1),
              level = level + $3, updated_by = $4, updated_at = now(), row_version = row_version + 1
        WHERE path LIKE $1 || '/%' AND is_deleted = false`,
      [oldPath, newPath, levelDelta, actor],
    );
    return update!;
  }

  mapReference(resource: ReferenceResource, row: Row): CatalogRecord {
    return mapReference(row, REFERENCES[resource]);
  }

  private productFilters(
    query: ProductListQuery | ProductSearchQuery,
    values: unknown[],
  ): string[] {
    const where = ['1 = 1'];
    if (!query.includeDeleted) where.push('p.is_deleted = false');
    if (!query.includeInactive && !query.status)
      where.push(`p.status NOT IN ('inactive', 'discontinued')`);
    const add = (column: string, value: unknown) => {
      values.push(value);
      where.push(`${column} = $${values.length}`);
    };
    if (query.status) add('p.status', query.status);
    if (query.productType) add('p.product_type', query.productType);
    if (query.categoryId) add('p.category_id', query.categoryId);
    if (query.brandId) add('p.brand_id', query.brandId);
    if (query.manufacturerId) add('p.manufacturer_id', query.manufacturerId);
    if (query.dosageFormId) add('p.dosage_form_id', query.dosageFormId);
    if (query.saltId) {
      values.push(query.saltId);
      where.push(
        `EXISTS (SELECT 1 FROM catalog.product_salts ps WHERE ps.product_id = p.id AND ps.salt_id = $${values.length})`,
      );
    }
    if (query.prescriptionRequired !== undefined)
      add('p.prescription_required', query.prescriptionRequired);
    if (query.createdFrom) {
      values.push(query.createdFrom);
      where.push(`p.created_at >= $${values.length}`);
    }
    if (query.createdTo) {
      values.push(query.createdTo);
      where.push(`p.created_at <= $${values.length}`);
    }
    if (query.updatedFrom) {
      values.push(query.updatedFrom);
      where.push(`p.updated_at >= $${values.length}`);
    }
    if (query.updatedTo) {
      values.push(query.updatedTo);
      where.push(`p.updated_at <= $${values.length}`);
    }
    return where;
  }
}

function normalizeKeywords(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function keyJson(value: unknown): unknown {
  return value && typeof value === 'object' ? JSON.stringify(value) : value;
}

function toCamelRow(row: Row): CatalogRecord {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase()),
      value,
    ]),
  );
}

function toCamelRowWithVersion(row: Row): CatalogRecord {
  return { ...toCamelRow(row), rowVersion: Number(row.row_version) };
}

function mapProductSummary(row: Row): CatalogRecord {
  return {
    ...toCamelRow(row),
    rowVersion: Number(row.row_version),
    availableQuantity: String(row.available_quantity ?? '0'),
  };
}

function mapReference(row: Row, definition: ReferenceDefinition): CatalogRecord {
  const metadata: CatalogRecord = {};
  const metadataFields: Record<string, string> = {
    legal_name: 'legalName',
    license_number: 'licenseNumber',
    country_code: 'countryCode',
    route_of_administration: 'routeOfAdministration',
    dimension: 'dimension',
    conversion_to_base: 'conversionToBase',
    standard_code: 'standardCode',
    logo_file_id: 'logoFileId',
    owner_organization_id: 'ownerOrganizationId',
    organization_id: 'organizationId',
    metadata_json: 'metadataJson',
  };
  for (const [field, external] of Object.entries(metadataFields))
    if (row[field] != null) metadata[external] = row[field];
  return {
    id: row.id,
    resourceType: definition.resourceType,
    name: row.name,
    code: row.code ?? null,
    slug: row.slug ?? null,
    description: row.description ?? null,
    parentId: row.parent_id ?? null,
    path: row.path ?? null,
    level: row.level ?? null,
    displayOrder: row.display_order ?? null,
    isActive: row.is_active ?? null,
    metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    rowVersion: Number(row.row_version),
  };
}
