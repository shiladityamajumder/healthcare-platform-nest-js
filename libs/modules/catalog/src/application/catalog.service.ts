// * Catalog module: Coordinates product, reference, relationship, and substitution-group use cases.
// * File: src/application/catalog.service.ts
// ? Keep business validation and transaction orchestration in the application boundary.
// ! Do not move HTTP concerns or raw SQL into this service.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unnecessary-type-assertion */
import { Inject, Injectable } from '@nestjs/common';
import { ConflictError, NotFoundError } from '@shared/errors';
import type {
  BulkProductStatusInput,
  CatalogRepositoryPort,
  CategoryCreateInput,
  CategoryUpdateInput,
  CreateProductInput,
  ProductListQuery,
  ProductRelationshipCreateInput,
  ProductRelationshipUpdateInput,
  ProductSearchQuery,
  ReferenceListQuery,
  ReferenceResource,
  ReplaceProductDetailsInput,
  SubstitutionGroupCreateInput,
  SubstitutionGroupListQuery,
  SubstitutionGroupProductCreateInput,
  SubstitutionGroupProductUpdateInput,
  SubstitutionGroupUpdateInput,
  UpdateProductInput,
} from '../contracts/catalog.ports';
import { CATALOG_REPOSITORY } from '../contracts/catalog.ports';
import type { CatalogRecord, PageResult, ProductDetails } from '../contracts/catalog.types';
import {
  CatalogConflictError,
  CatalogValidationError,
  ProductNotFoundError,
  normalizeName,
  slugify,
  validateStatusTransition,
  type ProductStatus,
} from '../contracts/catalog.rules';
type Input = Record<string, any>;

@Injectable()
/** Application service for the catalog bounded context. */
export class CatalogService {
  public constructor(
    @Inject(CATALOG_REPOSITORY) private readonly repository: CatalogRepositoryPort,
  ) {}

  /** Lists catalogue summaries using validated pagination and discovery filters. */
  async listProducts(query: ProductListQuery): Promise<PageResult<CatalogRecord>> {
    this.validateRanges(query);
    const result = await this.repository.listProducts(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

  /** Executes the catalogue search use case and enforces search-specific limits. */
  async searchProducts(query: ProductSearchQuery): Promise<PageResult<CatalogRecord>> {
    this.validateRanges(query);
    if (query.search.trim().length > 200) {
      throw new CatalogValidationError(
        'The search term exceeds the configured maximum length.',
        { maxLength: 200 },
        'SEARCH_TERM_TOO_LONG',
      );
    }
    const result = await this.repository.listProducts(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

  /** Loads the complete product aggregate for detail and administration screens. */
  async getProduct(id: string, includeDeleted = false): Promise<ProductDetails> {
    const product = await this.repository.getProductDetails(id, includeDeleted);
    if (!product) throw new ProductNotFoundError();
    return product;
  }

  /** Resolves a product by its public SKU or slug. */
  async getProductByCode(value: string): Promise<ProductDetails> {
    const row = await this.repository.getProductByCode(value);
    if (!row) throw new ProductNotFoundError();
    return this.getProduct(String(row.id));
  }

  /** Validates and creates a product master with its child collections atomically. */
  async createProduct(input: CreateProductInput, actor: string | null): Promise<ProductDetails> {
    const productSlug = slugify(input.slug || input.name) || slugify(input.sku);
    if (!productSlug)
      throw new CatalogValidationError('A URL-safe slug could not be derived from the product.');
    this.validateProductCollections(input);
    validateRegulatory(input.regulatory);
    if (!input.isReturnable && input.returnWindowDays != null && input.returnWindowDays !== 0) {
      throw new CatalogValidationError(
        'returnWindowDays must be empty or zero when isReturnable is false.',
      );
    }
    if (input.media.some((item) => item.variantId)) {
      throw new CatalogValidationError(
        'Variant-specific media must reference a persisted product variant.',
      );
    }
    if (input.identifiers.some((item) => item.variantId)) {
      throw new CatalogValidationError(
        'Variant-specific identifiers must be added after the product variants are persisted.',
      );
    }
    if (await this.repository.productDuplicate(input.sku.toUpperCase(), productSlug)) {
      throw new CatalogConflictError(
        'PRODUCT_ALREADY_EXISTS',
        'A product with this SKU or slug already exists.',
      );
    }
    await this.validateProductReferences(input);
    await this.validateIdentifiers(input.identifiers);
    await this.validateVariantSkus(input.variants);
    return this.repository.transaction(async () => {
      const id = await this.repository.createProduct(input, productSlug, actor);
      await this.repository.insertVariants(id, input.variants, actor);
      await this.repository.insertIdentifiers(id, input.identifiers, actor);
      await this.repository.insertSalts(id, input.salts, actor);
      await this.repository.insertAttributes(id, input.attributes, actor);
      await this.repository.insertContent(id, input.content, actor);
      await this.repository.insertMedia(id, input.media, actor);
      if (input.regulatory) await this.repository.insertRegulatory(id, input.regulatory, actor);
      return this.getProduct(id);
    });
  }

  /** Updates product master data with optimistic row-version protection. */
  async updateProduct(
    id: string,
    input: UpdateProductInput,
    actor: string | null,
  ): Promise<ProductDetails> {
    return this.repository.transaction(async () => {
      const current = await this.repository.getProductRow(id, false, true);
      if (!current) throw new ProductNotFoundError();
      const values = definedValues(input as Input);
      delete values.expectedRowVersion;
      if (!Object.keys(values).length)
        throw new CatalogValidationError('At least one field must be provided.');
      if (input.expectedRowVersion && input.expectedRowVersion !== Number(current.row_version)) {
        throw new CatalogConflictError(
          'PRODUCT_VERSION_CONFLICT',
          'The product changed after it was loaded.',
          { currentRowVersion: Number(current.row_version) },
        );
      }
      if (input.slug !== undefined) {
        values.slug = slugify(input.slug);
        if (!values.slug)
          throw new CatalogValidationError('slug must contain URL-safe characters.');
        if (await this.repository.productDuplicate(null, String(values.slug), id)) {
          throw new CatalogConflictError(
            'PRODUCT_ALREADY_EXISTS',
            'A product with this slug already exists.',
          );
        }
      }
      await this.validateUpdateReferences(values);
      const nextReturnable = values.isReturnable ?? current.is_returnable;
      const nextWindow = Object.prototype.hasOwnProperty.call(values, 'returnWindowDays')
        ? values.returnWindowDays
        : current.return_window_days;
      if (!nextReturnable && nextWindow != null && nextWindow !== 0) {
        throw new CatalogValidationError(
          'returnWindowDays must be empty or zero when isReturnable is false.',
        );
      }
      if (values.searchKeywords)
        values.searchKeywords = normalizeKeywords(values.searchKeywords as string[]);
      if (values.status) {
        validateStatusTransition(current.status as ProductStatus, values.status as ProductStatus);
        if (values.status === 'active' && !current.published_at) values.publishedAt = new Date();
        if (values.status === 'discontinued') values.discontinuedAt = new Date();
        else if (current.status === 'discontinued') values.discontinuedAt = null;
      }
      if (!(await this.repository.updateProduct(id, values, actor, Number(current.row_version)))) {
        throw new CatalogConflictError(
          'PRODUCT_VERSION_CONFLICT',
          'The product changed after it was loaded.',
        );
      }
      return this.getProduct(id);
    });
  }

  /** Replaces only the product detail collections supplied by the caller. */
  async replaceProductDetails(
    id: string,
    input: ReplaceProductDetailsInput,
    actor: string | null,
  ): Promise<ProductDetails> {
    return this.repository.transaction(async () => {
      const current = await this.repository.getProductRow(id, false, true);
      if (!current) throw new ProductNotFoundError();
      const values = definedValues(input as Input);
      if (!Object.keys(values).length)
        throw new CatalogValidationError('At least one detail collection must be provided.');
      this.validateReplacementCollections(input);
      validateRegulatory(input.regulatory);
      if (input.identifiers) {
        for (const item of input.identifiers) {
          if (item.variantId && !(await this.repository.variantMatches(item.variantId, id)))
            throw new CatalogValidationError(
              'An identifier variant does not belong to the product.',
              { variantId: item.variantId },
            );
        }
        await this.validateIdentifiers(input.identifiers, id);
        await this.repository.replaceSimpleChildren(id, 'identifiers', input.identifiers, actor);
      }
      if (input.salts) {
        for (const item of input.salts)
          await this.requireReference('salts', item.saltId, false, 'saltId');
        await this.repository.replaceSimpleChildren(id, 'salts', input.salts, actor);
      }
      if (input.attributes)
        await this.repository.replaceSimpleChildren(id, 'attributes', input.attributes, actor);
      if (input.variants) {
        await this.validateVariantSkus(input.variants, id);
        for (const item of input.variants)
          if (item.packUomId)
            await this.requireReference('units', item.packUomId, false, 'packUomId');
        await this.repository.replaceSoftDeletedChildren(id, 'variants', input.variants, actor);
      }
      if (input.content) await this.repository.replaceContent(id, input.content, actor);
      if (input.media) {
        if (input.variants && input.media.some((item) => item.variantId)) {
          throw new CatalogValidationError(
            'Variant-specific media cannot be supplied while replacing variants.',
          );
        }
        for (const item of input.media) {
          if (item.variantId && !(await this.repository.variantMatches(item.variantId, id))) {
            throw new CatalogValidationError('A media variant does not belong to the product.', {
              variantId: item.variantId,
            });
          }
        }
        await this.repository.replaceSoftDeletedChildren(id, 'media', input.media, actor);
      }
      if (Object.prototype.hasOwnProperty.call(input, 'regulatory')) {
        await this.repository.replaceSoftDeletedChildren(
          id,
          'regulatory',
          input.regulatory ? [input.regulatory] : [],
          actor,
        );
      }
      if (!(await this.repository.updateProduct(id, {}, actor, Number(current.row_version)))) {
        throw new CatalogConflictError(
          'PRODUCT_VERSION_CONFLICT',
          'The product changed after it was loaded.',
        );
      }
      return this.getProduct(id);
    });
  }

  /** Soft-deletes a product from normal catalogue visibility. */
  async deactivateProduct(id: string, actor: string | null) {
    if (!(await this.repository.deactivateProduct(id, actor))) throw new ProductNotFoundError();
    return { message: 'The product has been deactivated.' };
  }

  /** Restores a soft-deleted product after uniqueness checks. */
  async reactivateProduct(id: string, actor: string | null): Promise<ProductDetails> {
    return this.repository.transaction(async () => {
      const product = await this.repository.getProductRow(id, true, true);
      if (!product) throw new ProductNotFoundError();
      if (!product.is_deleted)
        throw new ConflictError('The product is already active in the catalogue.');
      if (await this.repository.productDuplicate(String(product.sku), String(product.slug), id)) {
        throw new CatalogConflictError(
          'PRODUCT_ALREADY_EXISTS',
          'The product cannot be restored because its SKU or slug is now in use.',
        );
      }
      await this.repository.reactivateProduct(id, actor);
      return this.getProduct(id);
    });
  }

  /** Applies a validated lifecycle transition to multiple products in one transaction. */
  async bulkProductStatus(input: BulkProductStatusInput, actor: string | null) {
    return this.repository.transaction(async () => {
      const rows = await this.repository.listProductRowsForUpdate(input.productIds);
      if (rows.length !== input.productIds.length) {
        const found = new Set(rows.map((row) => String(row.id)));
        throw new ProductNotFoundError({
          missingProductIds: input.productIds.filter((id) => !found.has(id)),
        });
      }
      for (const row of rows) {
        validateStatusTransition(row.status as ProductStatus, input.status);
        await this.repository.updateProductStatus(
          String(row.id),
          input.status,
          actor,
          String(row.status),
        );
      }
      return { updatedCount: rows.length, productIds: input.productIds };
    });
  }

  /** Lists configured directed product relationships for recommendations and merchandising. */
  async listProductRelationships(productId: string, relationshipType?: string) {
    if (!(await this.repository.getProductRow(productId))) throw new ProductNotFoundError();
    return {
      data: { items: await this.repository.listProductRelationships(productId, relationshipType) },
    };
  }

  /** Loads one relationship belonging to the supplied source product. */
  async getProductRelationship(productId: string, relationshipId: string): Promise<CatalogRecord> {
    const row = await this.repository.getProductRelationship(productId, relationshipId);
    if (!row) throw new NotFoundError('The product relationship was not found.');
    return camelizeCatalogRow(row);
  }

  /** Creates a relationship after validating both products and duplicate state. */
  async createProductRelationship(
    productId: string,
    input: ProductRelationshipCreateInput,
    actor: string | null,
  ): Promise<CatalogRecord> {
    return this.repository.transaction(async () => {
      await this.requireProduct(productId);
      if (productId === input.targetProductId)
        throw new CatalogValidationError('A product cannot relate to itself.');
      await this.requireProduct(input.targetProductId);
      if (
        await this.repository.productRelationshipExists(
          productId,
          input.targetProductId,
          input.relationshipType,
        )
      )
        throw new CatalogConflictError(
          'PRODUCT_RELATIONSHIP_ALREADY_EXISTS',
          'This product relationship already exists.',
        );
      return camelizeCatalogRow(
        await this.repository.createProductRelationship(productId, input, actor),
      );
    });
  }

  /** Updates a relationship while protecting concurrent administration edits. */
  async updateProductRelationship(
    productId: string,
    relationshipId: string,
    input: ProductRelationshipUpdateInput,
    actor: string | null,
  ): Promise<CatalogRecord> {
    return this.repository.transaction(async () => {
      const current = await this.repository.getProductRelationship(productId, relationshipId, true);
      if (!current) throw new NotFoundError('The product relationship was not found.');
      const values = definedValues(input as Input);
      delete values.expectedRowVersion;
      if (!Object.keys(values).length)
        throw new CatalogValidationError('At least one field must be provided.');
      if (input.targetProductId) {
        if (input.targetProductId === productId)
          throw new CatalogValidationError('A product cannot relate to itself.');
        await this.requireProduct(input.targetProductId);
      }
      const targetProductId = input.targetProductId ?? String(current.target_product_id);
      const relationshipType = input.relationshipType ?? String(current.relationship_type);
      if (
        await this.repository.productRelationshipExists(
          productId,
          targetProductId,
          relationshipType,
          relationshipId,
        )
      )
        throw new CatalogConflictError(
          'PRODUCT_RELATIONSHIP_ALREADY_EXISTS',
          'This product relationship already exists.',
        );
      const row = await this.repository.updateProductRelationship(
        productId,
        relationshipId,
        values,
        actor,
        input.expectedRowVersion,
      );
      if (!row)
        throw new CatalogConflictError(
          'PRODUCT_RELATIONSHIP_VERSION_CONFLICT',
          'The product relationship changed after it was loaded.',
        );
      return camelizeCatalogRow(row);
    });
  }

  /** Removes a directed product relationship. */
  async deleteProductRelationship(productId: string, relationshipId: string) {
    if (!(await this.repository.deleteProductRelationship(productId, relationshipId)))
      throw new NotFoundError('The product relationship was not found.');
    return { message: 'The product relationship has been removed.' };
  }

  /** Resolves substitution groups containing a product for alternative selection. */
  async listProductSubstitutionGroups(productId: string) {
    await this.requireProduct(productId);
    return { data: { items: await this.repository.listProductSubstitutionGroups(productId) } };
  }

  /** Lists substitution-group signatures for administration and matching workflows. */
  async listSubstitutionGroups(
    query: SubstitutionGroupListQuery,
  ): Promise<PageResult<CatalogRecord>> {
    const result = await this.repository.listSubstitutionGroups(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

  /** Loads one substitution-group signature. */
  async getSubstitutionGroup(id: string, includeDeleted = false): Promise<CatalogRecord> {
    const row = await this.repository.getSubstitutionGroup(id, includeDeleted);
    if (!row) throw new NotFoundError('The substitution group was not found.');
    return camelizeCatalogRow(row);
  }

  /** Creates a unique substitution-group signature. */
  async createSubstitutionGroup(
    input: SubstitutionGroupCreateInput,
    actor: string | null,
  ): Promise<CatalogRecord> {
    if (input.dosageFormId)
      await this.requireReference('dosageForms', input.dosageFormId, true, 'dosageFormId');
    if (
      await this.repository.substitutionGroupDuplicate(
        input.saltSignature,
        input.dosageFormId,
        input.strengthSignature,
      )
    )
      throw new CatalogConflictError(
        'SUBSTITUTION_GROUP_ALREADY_EXISTS',
        'A substitution group with the same signature already exists.',
      );
    return camelizeCatalogRow(await this.repository.createSubstitutionGroup(input, actor));
  }

  /** Updates a substitution-group signature with duplicate and version checks. */
  async updateSubstitutionGroup(
    id: string,
    input: SubstitutionGroupUpdateInput,
    actor: string | null,
  ): Promise<CatalogRecord> {
    return this.repository.transaction(async () => {
      const current = await this.repository.getSubstitutionGroup(id, false, true);
      if (!current) throw new NotFoundError('The substitution group was not found.');
      const values = definedValues(input as Input);
      delete values.expectedRowVersion;
      if (!Object.keys(values).length)
        throw new CatalogValidationError('At least one field must be provided.');
      if (input.dosageFormId)
        await this.requireReference('dosageForms', input.dosageFormId, true, 'dosageFormId');
      const saltSignature = input.saltSignature ?? String(current.salt_signature);
      const dosageFormId = Object.prototype.hasOwnProperty.call(input, 'dosageFormId')
        ? input.dosageFormId
        : (current.dosage_form_id as string | null | undefined);
      const strengthSignature = Object.prototype.hasOwnProperty.call(input, 'strengthSignature')
        ? input.strengthSignature
        : (current.strength_signature as string | null | undefined);
      if (
        await this.repository.substitutionGroupDuplicate(
          saltSignature,
          dosageFormId,
          strengthSignature,
          id,
        )
      )
        throw new CatalogConflictError(
          'SUBSTITUTION_GROUP_ALREADY_EXISTS',
          'A substitution group with the same signature already exists.',
        );
      const row = await this.repository.updateSubstitutionGroup(
        id,
        values,
        actor,
        input.expectedRowVersion,
      );
      if (!row)
        throw new CatalogConflictError(
          'SUBSTITUTION_GROUP_VERSION_CONFLICT',
          'The substitution group changed after it was loaded.',
        );
      return camelizeCatalogRow(row);
    });
  }

  /** Soft-deactivates a substitution group. */
  async deactivateSubstitutionGroup(id: string, actor: string | null) {
    if (!(await this.repository.deactivateSubstitutionGroup(id, actor)))
      throw new NotFoundError('The substitution group was not found.');
    return { message: 'The substitution group has been deactivated.' };
  }

  /** Restores a soft-deleted substitution group. */
  async reactivateSubstitutionGroup(id: string, actor: string | null): Promise<CatalogRecord> {
    const row = await this.repository.reactivateSubstitutionGroup(id, actor);
    if (!row) throw new NotFoundError('The substitution group was not found.');
    return camelizeCatalogRow(row);
  }

  /** Lists the products and priorities assigned to a substitution group. */
  async listSubstitutionGroupProducts(groupId: string) {
    await this.requireSubstitutionGroup(groupId);
    return { data: { items: await this.repository.listSubstitutionGroupProducts(groupId) } };
  }

  /** Adds a product membership after group, product, and duplicate checks. */
  async addSubstitutionGroupProduct(
    groupId: string,
    input: SubstitutionGroupProductCreateInput,
    actor: string | null,
  ): Promise<CatalogRecord> {
    return this.repository.transaction(async () => {
      await this.requireSubstitutionGroup(groupId);
      await this.requireProduct(input.productId);
      if (await this.repository.substitutionGroupProductExists(groupId, input.productId))
        throw new CatalogConflictError(
          'SUBSTITUTION_GROUP_PRODUCT_ALREADY_EXISTS',
          'The product is already a member of this substitution group.',
        );
      return camelizeCatalogRow(
        await this.repository.addSubstitutionGroupProduct(groupId, input, actor),
      );
    });
  }

  /** Updates membership priority with optional row-version protection. */
  async updateSubstitutionGroupProduct(
    groupId: string,
    productId: string,
    input: SubstitutionGroupProductUpdateInput,
    actor: string | null,
  ): Promise<CatalogRecord> {
    const row = await this.repository.updateSubstitutionGroupProduct(
      groupId,
      productId,
      { priority: input.priority },
      actor,
      input.expectedRowVersion,
    );
    if (!row) throw new NotFoundError('The substitution group product membership was not found.');
    return camelizeCatalogRow(row);
  }

  /** Removes a product membership from a substitution group. */
  async removeSubstitutionGroupProduct(groupId: string, productId: string) {
    if (!(await this.repository.removeSubstitutionGroupProduct(groupId, productId)))
      throw new NotFoundError('The substitution group product membership was not found.');
    return { message: 'The product has been removed from the substitution group.' };
  }

  /** Lists one of the generic catalog reference-master resources. */
  async listReferences(
    resource: ReferenceResource,
    query: ReferenceListQuery,
  ): Promise<PageResult<CatalogRecord>> {
    const result = await this.repository.listReferences(resource, query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

  /** Loads one generic reference-master record. */
  async getReference(
    resource: ReferenceResource,
    id: string,
    includeDeleted = false,
  ): Promise<CatalogRecord> {
    const row = await this.repository.getReference(resource, id, includeDeleted);
    if (!row) throw new NotFoundError(`The ${resourceName(resource)} was not found.`);
    return this.repository.mapReference(resource, row);
  }

  /** Creates one generic reference-master record after application validation. */
  async createReference(
    resource: ReferenceResource,
    input: Input,
    actor: string | null,
  ): Promise<CatalogRecord> {
    if (resource === 'categories') return this.createCategory(input as CategoryCreateInput, actor);
    const values = normalizeReference(resource, input);
    await this.ensureReferenceUnique(resource, values);
    if (resource === 'manufacturers' && values.name)
      await this.ensureManufacturerName(String(values.name));
    const row = await this.repository.createReference(resource, values, actor);
    return this.repository.mapReference(resource, row);
  }

  /** Updates one generic reference-master record. */
  async updateReference(
    resource: ReferenceResource,
    id: string,
    input: Input,
    actor: string | null,
  ): Promise<CatalogRecord> {
    if (resource === 'categories')
      return this.updateCategory(id, input as CategoryUpdateInput, actor);
    return this.repository.transaction(async () => {
      if (!Object.keys(input).length)
        throw new CatalogValidationError('At least one field must be provided.');
      if (!(await this.repository.getReference(resource, id, false, true)))
        throw new NotFoundError(`The ${resourceName(resource)} was not found.`);
      const values = normalizeReference(resource, definedValues(input));
      await this.ensureReferenceUnique(resource, values, id);
      if (resource === 'manufacturers' && values.name)
        await this.ensureManufacturerName(String(values.name), id);
      const row = await this.repository.updateReference(resource, id, values, actor);
      if (!row) throw new NotFoundError(`The ${resourceName(resource)} was not found.`);
      return this.repository.mapReference(resource, row);
    });
  }

  /** Soft-deactivates a generic reference-master record. */
  async deactivateReference(resource: ReferenceResource, id: string, actor: string | null) {
    if (resource === 'categories') return this.deactivateCategory(id, actor);
    if (!(await this.repository.deactivateReference(resource, id, actor)))
      throw new NotFoundError(`The ${resourceName(resource)} was not found.`);
    return { message: `The ${resourceName(resource)} has been deactivated.` };
  }

  /** Restores a soft-deleted generic reference-master record. */
  async reactivateReference(
    resource: ReferenceResource,
    id: string,
    actor: string | null,
  ): Promise<CatalogRecord> {
    if (resource === 'categories') return this.reactivateCategory(id, actor);
    const current = await this.repository.getReference(resource, id, true, true);
    if (!current) throw new NotFoundError(`The ${resourceName(resource)} was not found.`);
    const values = duplicateValues(resource, current);
    await this.ensureReferenceUnique(resource, values, id);
    const row = await this.repository.reactivateReference(resource, id, actor);
    return this.repository.mapReference(resource, row!);
  }

  /** Builds nested category navigation from flat hierarchy rows. */
  async categoryTree(includeInactive = false): Promise<{ items: CatalogRecord[] }> {
    const rows = await this.repository.categoryTreeRows();
    const nodes = new Map<string, CatalogRecord & { children: CatalogRecord[] }>();
    for (const row of rows) {
      if (!includeInactive && !row.is_active) continue;
      nodes.set(String(row.id), {
        id: row.id,
        name: row.name,
        slug: row.slug,
        path: row.path,
        level: row.level,
        displayOrder: row.display_order,
        isActive: row.is_active,
        children: [],
      });
    }
    const roots: CatalogRecord[] = [];
    for (const row of rows) {
      const node = nodes.get(String(row.id));
      if (!node) continue;
      const parent = row.parent_id ? nodes.get(dbString(row.parent_id)) : undefined;
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
    return { items: roots };
  }

  private async createCategory(
    input: CategoryCreateInput,
    actor: string | null,
  ): Promise<CatalogRecord> {
    const categorySlug = slugify(input.slug || input.name);
    if (!categorySlug)
      throw new CatalogValidationError('A URL-safe category slug could not be generated.');
    if (await this.repository.referenceDuplicate('categories', 'slug', categorySlug))
      throw new CatalogConflictError(
        'CATEGORY_ALREADY_EXISTS',
        'An active category with this slug already exists.',
      );
    let path = categorySlug;
    let level = 0;
    if (input.parentId) {
      const parent = await this.repository.getReference('categories', input.parentId);
      if (!parent) throw new NotFoundError('The parent category was not found.');
      if (!parent.is_active) throw new ConflictError('The parent category must be active.');
      path = `${dbString(parent.path)}/${categorySlug}`;
      level = Number(parent.level) + 1;
    }
    const row = await this.repository.createReference(
      'categories',
      {
        parent_id: input.parentId ?? null,
        name: input.name.trim(),
        slug: categorySlug,
        path,
        level,
        display_order: input.displayOrder,
        is_active: input.isActive,
        metadata_json: input.metadataJson,
      },
      actor,
    );
    return this.repository.mapReference('categories', row);
  }

  private async updateCategory(
    id: string,
    input: CategoryUpdateInput,
    actor: string | null,
  ): Promise<CatalogRecord> {
    return this.repository.transaction(async () => {
      if (!Object.keys(input).length)
        throw new CatalogValidationError('At least one field must be provided.');
      const category = await this.repository.getReference('categories', id, false, true);
      if (!category) throw new NotFoundError('The category was not found.');
      const categorySlug = slugify(input.slug ?? input.name ?? String(category.slug));
      if (!categorySlug)
        throw new CatalogValidationError('A URL-safe category slug could not be generated.');
      if (
        categorySlug !== category.slug &&
        (await this.repository.referenceDuplicate('categories', 'slug', categorySlug, id))
      )
        throw new CatalogConflictError(
          'CATEGORY_ALREADY_EXISTS',
          'An active category with this slug already exists.',
        );
      const parentId: string | null = Object.prototype.hasOwnProperty.call(input, 'parentId')
        ? (input.parentId ?? null)
        : dbNullableString(category.parent_id);
      if (parentId === id) throw new CatalogValidationError('A category cannot be its own parent.');
      let newPath = categorySlug;
      let newLevel = 0;
      if (parentId) {
        const parent = await this.repository.getReference('categories', parentId, false, true);
        if (!parent) throw new NotFoundError('The parent category was not found.');
        if (!parent.is_active) throw new ConflictError('The parent category must be active.');
        if (
          parent.path === category.path ||
          dbString(parent.path).startsWith(`${dbString(category.path)}/`)
        )
          throw new CatalogValidationError(
            'A category cannot be moved below one of its descendants.',
          );
        newPath = `${dbString(parent.path)}/${categorySlug}`;
        newLevel = Number(parent.level) + 1;
      }
      const values: Input = {
        parent_id: parentId,
        slug: categorySlug,
        path: newPath,
        level: newLevel,
      };
      if (input.name !== undefined) values.name = input.name.trim();
      if (input.displayOrder !== undefined) values.display_order = input.displayOrder;
      if (input.isActive !== undefined) values.is_active = input.isActive;
      if (input.metadataJson !== undefined) values.metadata_json = input.metadataJson;
      const row = await this.repository.updateCategoryHierarchy(
        id,
        String(category.path),
        newPath,
        newLevel - Number(category.level),
        values,
        actor,
      );
      return this.repository.mapReference('categories', row);
    });
  }

  private async deactivateCategory(id: string, actor: string | null) {
    return this.repository.transaction(async () => {
      const category = await this.repository.getReference('categories', id, false, true);
      if (!category) throw new NotFoundError('The category was not found.');
      if (
        (await this.repository.categoryDescendants(String(category.path))).some(
          (row) => !row.is_deleted,
        )
      ) {
        throw new CatalogConflictError(
          'CATEGORY_HAS_DESCENDANTS',
          'A category with active descendants cannot be deleted.',
        );
      }
      await this.repository.deactivateReference('categories', id, actor);
      return { message: 'The category has been deactivated.' };
    });
  }

  private async reactivateCategory(id: string, actor: string | null): Promise<CatalogRecord> {
    return this.repository.transaction(async () => {
      const category = await this.repository.getReference('categories', id, true, true);
      if (!category) throw new NotFoundError('The category was not found.');
      if (await this.repository.referenceDuplicate('categories', 'slug', category.slug, id))
        throw new CatalogConflictError(
          'CATEGORY_ALREADY_EXISTS',
          'The category slug is now in use.',
        );
      if (category.parent_id) {
        const parent = await this.repository.getReference(
          'categories',
          dbString(category.parent_id),
        );
        if (!parent || !parent.is_active)
          throw new CatalogConflictError(
            'CATEGORY_PARENT_INACTIVE',
            'The parent category must be active before this category is restored.',
          );
      }
      const row = await this.repository.reactivateReference('categories', id, actor);
      return this.repository.mapReference('categories', row!);
    });
  }

  private validateRanges(query: ProductListQuery): void {
    if (query.createdFrom && query.createdTo && query.createdFrom > query.createdTo)
      throw new CatalogValidationError('createdFrom cannot be after createdTo.');
    if (query.updatedFrom && query.updatedTo && query.updatedFrom > query.updatedTo)
      throw new CatalogValidationError('updatedFrom cannot be after updatedTo.');
  }

  private async requireProduct(id: string): Promise<void> {
    if (!(await this.repository.getProductRow(id))) throw new ProductNotFoundError();
  }

  private async requireSubstitutionGroup(id: string): Promise<void> {
    if (!(await this.repository.getSubstitutionGroup(id)))
      throw new NotFoundError('The substitution group was not found.');
  }

  private validateProductCollections(
    input: Pick<
      CreateProductInput,
      'variants' | 'identifiers' | 'salts' | 'attributes' | 'content' | 'media'
    >,
  ): void {
    assertUnique(
      input.variants.map((item) => item.variantSku),
      'variantSku',
    );
    assertUnique(
      input.identifiers.map((item) => `${item.identifierType}\u0000${item.identifierValue}`),
      'identifier',
    );
    assertUnique(
      input.salts.map((item) => `${item.saltId}\u0000${item.sequence}`),
      'salt/sequence',
    );
    assertUnique(
      input.attributes.map((item) => item.attributeKey),
      'attributeKey',
    );
    assertUnique(
      input.content.map((item) => `${item.locale}\u0000${item.contentType}`),
      'content locale/type',
    );
    if (input.variants.filter((item) => item.isDefault).length > 1)
      throw new CatalogValidationError('Only one product variant can be the default.');
    if (input.media.filter((item) => item.isPrimary && !item.variantId).length > 1)
      throw new CatalogValidationError('Only one product-level media item can be primary.');
    for (const variant of input.variants)
      if (Number(variant.packQuantity) <= 0)
        throw new CatalogValidationError('packQuantity must be greater than zero.');
  }

  private validateReplacementCollections(input: ReplaceProductDetailsInput): void {
    this.validateProductCollections({
      variants: input.variants ?? [],
      identifiers: input.identifiers ?? [],
      salts: input.salts ?? [],
      attributes: input.attributes ?? [],
      content: input.content ?? [],
      media: input.media ?? [],
    });
  }

  private async validateProductReferences(input: CreateProductInput): Promise<void> {
    if (input.brandId) await this.requireReference('brands', input.brandId, true, 'brandId');
    if (input.manufacturerId)
      await this.requireReference('manufacturers', input.manufacturerId, true, 'manufacturerId');
    if (input.categoryId)
      await this.requireReference('categories', input.categoryId, true, 'categoryId');
    if (input.dosageFormId)
      await this.requireReference('dosageForms', input.dosageFormId, true, 'dosageFormId');
    for (const item of input.salts)
      await this.requireReference('salts', item.saltId, false, 'saltId');
    for (const item of input.variants)
      if (item.packUomId) await this.requireReference('units', item.packUomId, false, 'packUomId');
  }

  private async validateUpdateReferences(values: Input): Promise<void> {
    const refs = [
      ['brandId', 'brands', true],
      ['manufacturerId', 'manufacturers', true],
      ['categoryId', 'categories', true],
      ['dosageFormId', 'dosageForms', true],
    ] as const;
    for (const [field, table, active] of refs)
      if (values[field]) await this.requireReference(table, String(values[field]), active, field);
  }

  private async requireReference(
    table: string,
    id: string,
    active: boolean,
    field: string,
  ): Promise<void> {
    if (!(await this.repository.referenceExists(table, id, active)))
      throw new CatalogValidationError('A referenced catalogue record does not exist.', {
        [field]: id,
      });
  }

  private async validateIdentifiers(
    items: readonly Input[],
    excludeProductId?: string,
  ): Promise<void> {
    for (const item of items)
      if (
        await this.repository.identifierExists(
          String(item.identifierType),
          String(item.identifierValue),
          excludeProductId,
        )
      )
        throw new CatalogConflictError(
          'PRODUCT_ALREADY_EXISTS',
          'A product identifier is already in use.',
          { identifierType: item.identifierType, identifierValue: item.identifierValue },
        );
  }

  private async validateVariantSkus(
    items: readonly Input[],
    excludeProductId?: string,
  ): Promise<void> {
    for (const item of items)
      if (await this.repository.variantSkuExists(String(item.variantSku), excludeProductId))
        throw new CatalogConflictError(
          'PRODUCT_ALREADY_EXISTS',
          'A product variant SKU is already in use.',
          { variantSku: item.variantSku },
        );
  }

  private async ensureReferenceUnique(
    resource: ReferenceResource,
    values: Input,
    excludeId?: string,
  ): Promise<void> {
    for (const [field, value] of Object.entries(duplicateValues(resource, values))) {
      if (
        value != null &&
        (await this.repository.referenceDuplicate(resource, field, value, excludeId))
      )
        throw new CatalogConflictError(
          `${resourceName(resource).toUpperCase()}_ALREADY_EXISTS`,
          `An active ${resourceName(resource)} with the same ${field.replaceAll('_', ' ')} already exists.`,
        );
    }
  }

  private async ensureManufacturerName(name: string, excludeId?: string): Promise<void> {
    const query: ReferenceListQuery = {
      search: name,
      page: 1,
      pageSize: 100,
      includeDeleted: false,
      sortBy: 'name',
      sortOrder: 'asc',
    };
    const result = await this.repository.listReferences('manufacturers', query);
    if (
      result.rows.some(
        (row) => row.id !== excludeId && normalizeName(String(row.name)) === normalizeName(name),
      )
    )
      throw new CatalogConflictError(
        'MANUFACTURER_ALREADY_EXISTS',
        'An active manufacturer with the same name already exists.',
      );
  }
}

function pageResult<T>(items: T[], total: number, page: number, pageSize: number): PageResult<T> {
  const offset = (page - 1) * pageSize;
  return {
    data: { items },
    pagination: {
      totalCount: total,
      limit: pageSize,
      offset,
      hasNext: offset + items.length < total,
    },
  };
}

function definedValues(input: Input): Input {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
}

function normalizeKeywords(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function assertUnique(values: readonly string[], field: string): void {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    else seen.add(value);
  }
  if (duplicates.size)
    throw new CatalogValidationError(`Duplicate ${field} values are not allowed.`, {
      duplicates: [...duplicates],
    });
}

function resourceName(resource: ReferenceResource): string {
  return resource === 'dosage-forms'
    ? 'dosage form'
    : resource === 'units'
      ? 'unit'
      : resource.replace(/s$/, '');
}

function normalizeReference(resource: ReferenceResource, input: Input): Input {
  const values: Input = {};
  const mapping: Record<string, string> = {
    name: 'name',
    slug: 'slug',
    description: 'description',
    logoFileId: 'logo_file_id',
    ownerOrganizationId: 'owner_organization_id',
    isActive: 'is_active',
    organizationId: 'organization_id',
    legalName: 'legal_name',
    licenseNumber: 'license_number',
    countryCode: 'country_code',
    standardCode: 'standard_code',
    code: 'code',
    routeOfAdministration: 'route_of_administration',
    dimension: 'dimension',
    conversionToBase: 'conversion_to_base',
    metadataJson: 'metadata_json',
  };
  for (const [key, value] of Object.entries(input)) if (mapping[key]) values[mapping[key]] = value;
  if (typeof values.name === 'string') values.name = values.name.trim().replace(/\s+/g, ' ');
  if (resource === 'brands') {
    const brandSlug = slugify(String(values.slug || values.name || ''));
    if (!brandSlug)
      throw new CatalogValidationError('A URL-safe brand slug could not be generated.');
    values.slug = brandSlug;
  }
  if (resource === 'salts' && values.name)
    values.normalized_name = normalizeName(String(values.name));
  if (values.code) values.code = String(values.code).trim().toUpperCase();
  if (values.country_code) values.country_code = String(values.country_code).toUpperCase();
  if (
    resource === 'units' &&
    values.conversion_to_base !== undefined &&
    (!Number.isFinite(Number(values.conversion_to_base)) || Number(values.conversion_to_base) <= 0)
  ) {
    throw new CatalogValidationError('conversionToBase must be greater than zero.');
  }
  return values;
}

function duplicateValues(resource: ReferenceResource, values: Input): Input {
  const fields: Partial<Record<ReferenceResource, readonly string[]>> = {
    brands: ['name', 'slug'],
    manufacturers: ['license_number'],
    categories: ['slug'],
    salts: ['normalized_name'],
    'dosage-forms': ['code'],
    units: ['code'],
  };
  return Object.fromEntries((fields[resource] ?? []).map((field) => [field, values[field]]));
}

function dbString(value: unknown): string {
  if (typeof value !== 'string') throw new Error('The database returned an invalid string value.');
  return value;
}

function dbNullableString(value: unknown): string | null {
  return value == null ? null : dbString(value);
}

function validateRegulatory(input: { maxOrderQuantity?: string } | null | undefined): void {
  if (
    input?.maxOrderQuantity !== undefined &&
    (!Number.isFinite(Number(input.maxOrderQuantity)) || Number(input.maxOrderQuantity) <= 0)
  ) {
    throw new CatalogValidationError('maxOrderQuantity must be greater than zero.');
  }
}

function camelizeCatalogRow(row: Record<string, unknown>): CatalogRecord {
  const mapped = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase()),
      value,
    ]),
  ) as CatalogRecord;
  if (row.row_version !== undefined) mapped.rowVersion = Number(row.row_version);
  return mapped;
}
