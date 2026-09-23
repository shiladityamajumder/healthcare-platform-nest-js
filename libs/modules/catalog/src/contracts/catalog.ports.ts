// * Catalog module: Defines application-to-infrastructure ports and input contracts.
// * File: src/contracts/catalog.ports.ts
// ? Keep the application service independent from the PostgreSQL repository implementation.
// ! Changes here must preserve the externally managed database contract.
import type { ProductStatus, ProductType } from './catalog.rules';
import type { CatalogRecord, ProductDetails } from './catalog.types';

/** Shared pagination input consumed by catalog list operations. */
export interface PageQuery {
  page: number;
  pageSize: number;
}

/** Product browsing filters accepted by list and search use cases. */
export interface ProductListQuery extends PageQuery {
  search?: string;
  status?: ProductStatus;
  productType?: ProductType;
  categoryId?: string;
  brandId?: string;
  manufacturerId?: string;
  dosageFormId?: string;
  saltId?: string;
  prescriptionRequired?: boolean;
  includeInactive: boolean;
  includeDeleted: boolean;
  createdFrom?: Date;
  createdTo?: Date;
  updatedFrom?: Date;
  updatedTo?: Date;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/** Search-specific product query with exact-code matching support. */
export interface ProductSearchQuery extends ProductListQuery {
  search: string;
  exactCodeMatch: boolean;
}

/** Reference-master browsing filters shared by brands and medical references. */
export interface ReferenceListQuery extends PageQuery {
  search?: string;
  isActive?: boolean;
  includeDeleted: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/** Application input for a product variant child record. */
export interface ProductVariantInput {
  variantSku: string;
  name: string;
  strengthDisplay?: string;
  packQuantity: string;
  packUomId?: string;
  status: ProductStatus;
  isDefault: boolean;
}
/** Application input for a product identifier or barcode child record. */
export interface ProductIdentifierInput {
  variantId?: string;
  identifierType: string;
  identifierValue: string;
  isPrimary: boolean;
}
/** Application input for a product salt composition child record. */
export interface ProductSaltInput {
  saltId: string;
  strength?: string;
  sequence: number;
}
/** Application input for a structured product attribute child record. */
export interface ProductAttributeInput {
  attributeKey: string;
  attributeValue: Record<string, unknown> | unknown[];
  isFilterable: boolean;
}
/** Application input for localized product content. */
export interface ProductContentInput {
  locale: string;
  contentType: string;
  title?: string;
  body: string;
  structuredContent: Record<string, unknown> | unknown[];
}
/** Application input for product media attachment metadata. */
export interface ProductMediaInput {
  variantId?: string;
  mediaType: string;
  fileObjectId: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
}
/** Application input for product regulatory data. */
export interface ProductRegulatoryInput {
  drugLicenseCategory?: string;
  storageConditions?: string;
  controlledSubstance: boolean;
  maxOrderQuantity?: string;
  requiresColdChain: boolean;
  requiresAgeVerification: boolean;
  narcoticRegisterRequired: boolean;
  regulatoryMetadata: Record<string, unknown> | unknown[];
}

/** Application input used to create the product aggregate. */
export interface CreateProductInput {
  sku: string;
  name: string;
  displayName?: string;
  slug?: string;
  brandId?: string;
  manufacturerId?: string;
  categoryId?: string;
  productType: ProductType;
  dosageFormId?: string;
  strengthDisplay?: string;
  packSizeDisplay?: string;
  prescriptionRequired: boolean;
  scheduleClass?: string;
  isReturnable: boolean;
  returnWindowDays?: number;
  taxCode?: string;
  hsnCode?: string;
  status: ProductStatus;
  searchKeywords: string[];
  variants: ProductVariantInput[];
  identifiers: ProductIdentifierInput[];
  salts: ProductSaltInput[];
  attributes: ProductAttributeInput[];
  content: ProductContentInput[];
  media: ProductMediaInput[];
  regulatory?: ProductRegulatoryInput;
}

/** Partial application input for product master updates. */
export interface UpdateProductInput {
  name?: string;
  displayName?: string | null;
  slug?: string;
  brandId?: string | null;
  manufacturerId?: string | null;
  categoryId?: string | null;
  dosageFormId?: string | null;
  strengthDisplay?: string | null;
  packSizeDisplay?: string | null;
  prescriptionRequired?: boolean;
  scheduleClass?: string | null;
  isReturnable?: boolean;
  returnWindowDays?: number | null;
  taxCode?: string | null;
  hsnCode?: string | null;
  status?: ProductStatus;
  searchKeywords?: string[];
  expectedRowVersion?: number;
}
/** Application input for replacing selected product child collections. */
export interface ReplaceProductDetailsInput {
  variants?: ProductVariantInput[];
  identifiers?: ProductIdentifierInput[];
  salts?: ProductSaltInput[];
  attributes?: ProductAttributeInput[];
  content?: ProductContentInput[];
  media?: ProductMediaInput[];
  regulatory?: ProductRegulatoryInput | null;
}
/** Application input for bulk product lifecycle changes. */
export interface BulkProductStatusInput {
  productIds: string[];
  status: ProductStatus;
}

/** Application input for creating a directed product relationship. */
export interface ProductRelationshipCreateInput {
  targetProductId: string;
  relationshipType: string;
  priority: number;
  metadataJson: Record<string, unknown> | unknown[];
}
/** Partial application input for relationship updates. */
export interface ProductRelationshipUpdateInput {
  targetProductId?: string;
  relationshipType?: string;
  priority?: number;
  metadataJson?: Record<string, unknown> | unknown[];
  expectedRowVersion?: number;
}
/** Substitution-group list filters including dosage-form narrowing. */
export interface SubstitutionGroupListQuery extends ReferenceListQuery {
  dosageFormId?: string;
}
/** Application input for creating a substitution-group signature. */
export interface SubstitutionGroupCreateInput {
  saltSignature: string;
  dosageFormId?: string;
  strengthSignature?: string;
  isActive: boolean;
}
/** Partial application input for substitution-group updates. */
export interface SubstitutionGroupUpdateInput {
  saltSignature?: string;
  dosageFormId?: string | null;
  strengthSignature?: string | null;
  isActive?: boolean;
  expectedRowVersion?: number;
}
/** Application input for adding a product to a substitution group. */
export interface SubstitutionGroupProductCreateInput {
  productId: string;
  priority: number;
}
/** Application input for changing substitution membership priority. */
export interface SubstitutionGroupProductUpdateInput {
  priority: number;
  expectedRowVersion?: number;
}
/** Application input for creating a category hierarchy node. */
export interface CategoryCreateInput {
  parentId?: string;
  name: string;
  slug?: string;
  displayOrder: number;
  isActive: boolean;
  metadataJson: Record<string, unknown> | unknown[];
}
/** Partial application input for category hierarchy updates. */
export interface CategoryUpdateInput {
  parentId?: string | null;
  name?: string;
  slug?: string;
  displayOrder?: number;
  isActive?: boolean;
  metadataJson?: Record<string, unknown> | unknown[];
}

/** Fixed reference resource names accepted by the generic reference workflow. */
export type ReferenceResource =
  'brands' | 'manufacturers' | 'categories' | 'salts' | 'dosage-forms' | 'units';
/** Raw database-shaped record used at the repository boundary. */
export type DatabaseRow = Record<string, unknown>;

/** Persistence capabilities required by the catalog application service. */
export interface CatalogRepositoryPort {
  transaction<T>(work: () => Promise<T>): Promise<T>;
  listProducts(
    query: ProductListQuery | ProductSearchQuery,
  ): Promise<{ rows: CatalogRecord[]; total: number }>;
  getProductRow(
    id: string,
    includeDeleted?: boolean,
    forUpdate?: boolean,
  ): Promise<DatabaseRow | null>;
  getProductByCode(value: string): Promise<DatabaseRow | null>;
  getProductDetails(id: string, includeDeleted?: boolean): Promise<ProductDetails | null>;
  productDuplicate(sku: string | null, slug: string | null, excludeId?: string): Promise<boolean>;
  referenceExists(table: string, id: string, requiresActive?: boolean): Promise<boolean>;
  identifierExists(type: string, value: string, excludeProductId?: string): Promise<boolean>;
  variantSkuExists(sku: string, excludeProductId?: string): Promise<boolean>;
  variantMatches(variantId: string, productId: string): Promise<boolean>;
  productRelationshipExists(
    sourceProductId: string,
    targetProductId: string,
    relationshipType: string,
    excludeId?: string,
  ): Promise<boolean>;
  listProductRelationships(productId: string, relationshipType?: string): Promise<CatalogRecord[]>;
  getProductRelationship(
    productId: string,
    relationshipId: string,
    forUpdate?: boolean,
  ): Promise<DatabaseRow | null>;
  createProductRelationship(
    productId: string,
    input: ProductRelationshipCreateInput,
    actor: string | null,
  ): Promise<DatabaseRow>;
  updateProductRelationship(
    productId: string,
    relationshipId: string,
    values: DatabaseRow,
    actor: string | null,
    expectedRowVersion?: number,
  ): Promise<DatabaseRow | null>;
  deleteProductRelationship(productId: string, relationshipId: string): Promise<boolean>;
  listSubstitutionGroups(
    query: SubstitutionGroupListQuery,
  ): Promise<{ rows: CatalogRecord[]; total: number }>;
  getSubstitutionGroup(
    id: string,
    includeDeleted?: boolean,
    forUpdate?: boolean,
  ): Promise<DatabaseRow | null>;
  substitutionGroupDuplicate(
    saltSignature: string,
    dosageFormId?: string | null,
    strengthSignature?: string | null,
    excludeId?: string,
  ): Promise<boolean>;
  createSubstitutionGroup(
    input: SubstitutionGroupCreateInput,
    actor: string | null,
  ): Promise<DatabaseRow>;
  updateSubstitutionGroup(
    id: string,
    values: DatabaseRow,
    actor: string | null,
    expectedRowVersion?: number,
  ): Promise<DatabaseRow | null>;
  deactivateSubstitutionGroup(id: string, actor: string | null): Promise<boolean>;
  reactivateSubstitutionGroup(id: string, actor: string | null): Promise<DatabaseRow | null>;
  listSubstitutionGroupProducts(groupId: string): Promise<CatalogRecord[]>;
  listProductSubstitutionGroups(productId: string): Promise<CatalogRecord[]>;
  substitutionGroupProductExists(groupId: string, productId: string): Promise<boolean>;
  addSubstitutionGroupProduct(
    groupId: string,
    input: SubstitutionGroupProductCreateInput,
    actor: string | null,
  ): Promise<DatabaseRow>;
  updateSubstitutionGroupProduct(
    groupId: string,
    productId: string,
    values: DatabaseRow,
    actor: string | null,
    expectedRowVersion?: number,
  ): Promise<DatabaseRow | null>;
  removeSubstitutionGroupProduct(groupId: string, productId: string): Promise<boolean>;
  createProduct(input: CreateProductInput, slug: string, actor: string | null): Promise<string>;
  insertVariants(
    productId: string,
    items: readonly ProductVariantInput[],
    actor: string | null,
  ): Promise<void>;
  insertIdentifiers(
    productId: string,
    items: readonly ProductIdentifierInput[],
    actor: string | null,
  ): Promise<void>;
  insertSalts(
    productId: string,
    items: readonly ProductSaltInput[],
    actor: string | null,
  ): Promise<void>;
  insertAttributes(
    productId: string,
    items: readonly ProductAttributeInput[],
    actor: string | null,
  ): Promise<void>;
  insertContent(
    productId: string,
    items: readonly ProductContentInput[],
    actor: string | null,
  ): Promise<void>;
  insertMedia(
    productId: string,
    items: readonly ProductMediaInput[],
    actor: string | null,
  ): Promise<void>;
  insertRegulatory(
    productId: string,
    item: ProductRegulatoryInput,
    actor: string | null,
  ): Promise<void>;
  updateProduct(
    id: string,
    values: DatabaseRow,
    actor: string | null,
    expectedRowVersion?: number,
  ): Promise<boolean>;
  replaceSimpleChildren(
    productId: string,
    kind: 'identifiers' | 'salts' | 'attributes',
    items: readonly (ProductIdentifierInput | ProductSaltInput | ProductAttributeInput)[],
    actor: string | null,
  ): Promise<void>;
  replaceSoftDeletedChildren(
    productId: string,
    kind: 'variants' | 'media' | 'regulatory',
    items: readonly (ProductVariantInput | ProductMediaInput | ProductRegulatoryInput)[],
    actor: string | null,
  ): Promise<void>;
  replaceContent(
    productId: string,
    items: readonly ProductContentInput[],
    actor: string | null,
  ): Promise<void>;
  deactivateProduct(id: string, actor: string | null): Promise<boolean>;
  reactivateProduct(id: string, actor: string | null): Promise<void>;
  listProductRowsForUpdate(ids: readonly string[]): Promise<DatabaseRow[]>;
  updateProductStatus(
    id: string,
    status: string,
    actor: string | null,
    current: string,
  ): Promise<void>;
  listReferences(
    resource: ReferenceResource,
    query: ReferenceListQuery,
  ): Promise<{ rows: CatalogRecord[]; total: number }>;
  getReference(
    resource: ReferenceResource,
    id: string,
    includeDeleted?: boolean,
    forUpdate?: boolean,
  ): Promise<DatabaseRow | null>;
  referenceDuplicate(
    resource: ReferenceResource,
    column: string,
    value: unknown,
    excludeId?: string,
  ): Promise<boolean>;
  createReference(
    resource: ReferenceResource,
    values: DatabaseRow,
    actor: string | null,
  ): Promise<DatabaseRow>;
  updateReference(
    resource: ReferenceResource,
    id: string,
    values: DatabaseRow,
    actor: string | null,
  ): Promise<DatabaseRow | null>;
  deactivateReference(
    resource: ReferenceResource,
    id: string,
    actor: string | null,
  ): Promise<boolean>;
  reactivateReference(
    resource: ReferenceResource,
    id: string,
    actor: string | null,
  ): Promise<DatabaseRow | null>;
  categoryDescendants(path: string, forUpdate?: boolean): Promise<DatabaseRow[]>;
  categoryTreeRows(): Promise<DatabaseRow[]>;
  updateCategoryHierarchy(
    id: string,
    oldPath: string,
    newPath: string,
    levelDelta: number,
    values: DatabaseRow,
    actor: string | null,
  ): Promise<DatabaseRow>;
  mapReference(resource: ReferenceResource, row: DatabaseRow): CatalogRecord;
}

export const CATALOG_REPOSITORY = Symbol('CATALOG_REPOSITORY');
