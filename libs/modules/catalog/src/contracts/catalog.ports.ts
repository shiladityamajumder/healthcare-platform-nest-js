import type { ProductStatus, ProductType } from './catalog.rules';
import type { CatalogRecord, ProductDetails } from './catalog.types';

export interface PageQuery {
  page: number;
  pageSize: number;
}

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

export interface ProductSearchQuery extends ProductListQuery {
  search: string;
  exactCodeMatch: boolean;
}

export interface ReferenceListQuery extends PageQuery {
  search?: string;
  isActive?: boolean;
  includeDeleted: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ProductVariantInput {
  variantSku: string;
  name: string;
  strengthDisplay?: string;
  packQuantity: string;
  packUomId?: string;
  status: ProductStatus;
  isDefault: boolean;
}
export interface ProductIdentifierInput {
  variantId?: string;
  identifierType: string;
  identifierValue: string;
  isPrimary: boolean;
}
export interface ProductSaltInput {
  saltId: string;
  strength?: string;
  sequence: number;
}
export interface ProductAttributeInput {
  attributeKey: string;
  attributeValue: Record<string, unknown> | unknown[];
  isFilterable: boolean;
}
export interface ProductContentInput {
  locale: string;
  contentType: string;
  title?: string;
  body: string;
  structuredContent: Record<string, unknown> | unknown[];
}
export interface ProductMediaInput {
  variantId?: string;
  mediaType: string;
  fileObjectId: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
}
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
export interface ReplaceProductDetailsInput {
  variants?: ProductVariantInput[];
  identifiers?: ProductIdentifierInput[];
  salts?: ProductSaltInput[];
  attributes?: ProductAttributeInput[];
  content?: ProductContentInput[];
  media?: ProductMediaInput[];
  regulatory?: ProductRegulatoryInput | null;
}
export interface BulkProductStatusInput {
  productIds: string[];
  status: ProductStatus;
}

export interface ProductRelationshipCreateInput {
  targetProductId: string;
  relationshipType: string;
  priority: number;
  metadataJson: Record<string, unknown> | unknown[];
}
export interface ProductRelationshipUpdateInput {
  targetProductId?: string;
  relationshipType?: string;
  priority?: number;
  metadataJson?: Record<string, unknown> | unknown[];
  expectedRowVersion?: number;
}
export interface SubstitutionGroupListQuery extends ReferenceListQuery {
  dosageFormId?: string;
}
export interface SubstitutionGroupCreateInput {
  saltSignature: string;
  dosageFormId?: string;
  strengthSignature?: string;
  isActive: boolean;
}
export interface SubstitutionGroupUpdateInput {
  saltSignature?: string;
  dosageFormId?: string | null;
  strengthSignature?: string | null;
  isActive?: boolean;
  expectedRowVersion?: number;
}
export interface SubstitutionGroupProductCreateInput {
  productId: string;
  priority: number;
}
export interface SubstitutionGroupProductUpdateInput {
  priority: number;
  expectedRowVersion?: number;
}
export interface CategoryCreateInput {
  parentId?: string;
  name: string;
  slug?: string;
  displayOrder: number;
  isActive: boolean;
  metadataJson: Record<string, unknown> | unknown[];
}
export interface CategoryUpdateInput {
  parentId?: string | null;
  name?: string;
  slug?: string;
  displayOrder?: number;
  isActive?: boolean;
  metadataJson?: Record<string, unknown> | unknown[];
}

export type ReferenceResource =
  'brands' | 'manufacturers' | 'categories' | 'salts' | 'dosage-forms' | 'units';
export type DatabaseRow = Record<string, unknown>;

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
