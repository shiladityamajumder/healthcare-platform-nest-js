// * Catalog module: Defines validated request DTOs for product and reference APIs.
// * File: src/contracts/catalog.schema.ts
// ? Keep transport validation explicit so frontend payload requirements are discoverable.
// ! DTO validation does not replace application-level business and authorization rules.
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
  type ProductStatus,
  type ProductType,
} from './catalog.rules';

const booleanValue = ({ value }: { value: unknown }): unknown => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

// * DTO [PageQueryDto]: Validates shared pagination data crossing the HTTP boundary.
export class PageQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;
}

// * DTO [ProductIdentifierInputDto]: Validates product barcode and identifier data.
export class ProductIdentifierInputDto {
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(32)
  identifierType!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(128)
  identifierValue!: string;

  @IsOptional()
  @IsBoolean()
  isPrimary = false;
}

// * DTO [ProductSaltInputDto]: Validates active-ingredient composition data.
export class ProductSaltInputDto {
  @IsUUID()
  saltId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  strength?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(32767)
  sequence = 1;
}

// * DTO [ProductAttributeInputDto]: Validates structured product attribute data.
export class ProductAttributeInputDto {
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  attributeKey!: string;

  @IsDefined()
  attributeValue!: Record<string, unknown> | unknown[];

  @IsOptional()
  @IsBoolean()
  isFilterable = false;
}

// * DTO [ProductContentInputDto]: Validates localized product content data.
export class ProductContentInputDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  locale = 'en-IN';

  @IsString()
  @MinLength(1)
  @MaxLength(64)
  contentType!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsNotEmpty()
  body!: string;

  @IsOptional()
  @IsDefined()
  structuredContent: Record<string, unknown> | unknown[] = {};
}

// * DTO [ProductMediaInputDto]: Validates product media references and display metadata.
export class ProductMediaInputDto {
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(32)
  mediaType!: string;

  @IsUUID()
  fileObjectId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  displayOrder = 0;

  @IsOptional()
  @IsBoolean()
  isPrimary = false;
}

// * DTO [ProductRegulatoryInputDto]: Validates medicine regulatory and storage data.
export class ProductRegulatoryInputDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  drugLicenseCategory?: string;

  @IsOptional()
  @IsString()
  storageConditions?: string;

  @IsOptional()
  @IsBoolean()
  controlledSubstance = false;

  @IsOptional()
  @IsNumberString()
  maxOrderQuantity?: string;

  @IsOptional()
  @IsBoolean()
  requiresColdChain = false;

  @IsOptional()
  @IsBoolean()
  requiresAgeVerification = false;

  @IsOptional()
  @IsBoolean()
  narcoticRegisterRequired = false;

  @IsOptional()
  @IsDefined()
  regulatoryMetadata: Record<string, unknown> | unknown[] = {};
}

// * DTO [ProductVariantInputDto]: Validates sellable product variant data.
export class ProductVariantInputDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  variantSku!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  strengthDisplay?: string;

  @IsNumberString()
  packQuantity!: string;

  @IsOptional()
  @IsUUID()
  packUomId?: string;

  @IsOptional()
  @IsIn(PRODUCT_STATUSES)
  status: ProductStatus = 'draft';

  @IsOptional()
  @IsBoolean()
  isDefault = false;
}

// * DTO [CreateProductDto]: Validates a product master and optional child collections.
export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  sku!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;

  @IsOptional()
  @IsUUID()
  manufacturerId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsIn(PRODUCT_TYPES)
  productType!: ProductType;

  @IsOptional()
  @IsUUID()
  dosageFormId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  strengthDisplay?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  packSizeDisplay?: string;

  @IsOptional()
  @IsBoolean()
  prescriptionRequired = false;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  scheduleClass?: string;

  @IsOptional()
  @IsBoolean()
  isReturnable = true;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  returnWindowDays?: number;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  taxCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  hsnCode?: string;

  @IsOptional()
  @IsIn(PRODUCT_STATUSES)
  status: ProductStatus = 'draft';

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  searchKeywords: string[] = [];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => ProductVariantInputDto)
  variants: ProductVariantInputDto[] = [];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ProductIdentifierInputDto)
  identifiers: ProductIdentifierInputDto[] = [];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => ProductSaltInputDto)
  salts: ProductSaltInputDto[] = [];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeInputDto)
  attributes: ProductAttributeInputDto[] = [];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ProductContentInputDto)
  content: ProductContentInputDto[] = [];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ProductMediaInputDto)
  media: ProductMediaInputDto[] = [];

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductRegulatoryInputDto)
  regulatory?: ProductRegulatoryInputDto;
}

// * DTO [UpdateProductDto]: Validates partial product master updates.
export class UpdateProductDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) name?: string;
  @IsOptional() @IsString() @MaxLength(255) displayName?: string | null;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) slug?: string;
  @IsOptional() @IsUUID() brandId?: string | null;
  @IsOptional() @IsUUID() manufacturerId?: string | null;
  @IsOptional() @IsUUID() categoryId?: string | null;
  @IsOptional() @IsUUID() dosageFormId?: string | null;
  @IsOptional() @IsString() @MaxLength(128) strengthDisplay?: string | null;
  @IsOptional() @IsString() @MaxLength(128) packSizeDisplay?: string | null;
  @IsOptional() @IsBoolean() prescriptionRequired?: boolean;
  @IsOptional() @IsString() @MaxLength(32) scheduleClass?: string | null;
  @IsOptional() @IsBoolean() isReturnable?: boolean;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) returnWindowDays?: number | null;
  @IsOptional() @IsString() @MaxLength(64) taxCode?: string | null;
  @IsOptional() @IsString() @MaxLength(32) hsnCode?: string | null;
  @IsOptional() @IsIn(PRODUCT_STATUSES) status?: ProductStatus;
  @IsOptional() @IsArray() @ArrayMaxSize(100) @IsString({ each: true }) searchKeywords?: string[];
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) expectedRowVersion?: number;
}

// * DTO [ReplaceProductDetailsDto]: Validates complete replacement child collections.
export class ReplaceProductDetailsDto {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => ProductVariantInputDto)
  variants?: ProductVariantInputDto[];
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ProductIdentifierInputDto)
  identifiers?: ProductIdentifierInputDto[];
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => ProductSaltInputDto)
  salts?: ProductSaltInputDto[];
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeInputDto)
  attributes?: ProductAttributeInputDto[];
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ProductContentInputDto)
  content?: ProductContentInputDto[];
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ProductMediaInputDto)
  media?: ProductMediaInputDto[];
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductRegulatoryInputDto)
  regulatory?: ProductRegulatoryInputDto | null;
}

// * DTO [BulkProductStatusDto]: Validates bulk product lifecycle transitions.
export class BulkProductStatusDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  productIds!: string[];

  @IsIn(PRODUCT_STATUSES)
  status!: ProductStatus;
}

// * DTO [ProductListQueryDto]: Validates product browsing and filter query parameters.
export class ProductListQueryDto extends PageQueryDto {
  @IsOptional() @IsString() @MaxLength(1000) search?: string;
  @IsOptional() @IsIn(PRODUCT_STATUSES) status?: ProductStatus;
  @IsOptional() @IsIn(PRODUCT_TYPES) productType?: ProductType;
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsUUID() brandId?: string;
  @IsOptional() @IsUUID() manufacturerId?: string;
  @IsOptional() @IsUUID() dosageFormId?: string;
  @IsOptional() @IsUUID() saltId?: string;
  @IsOptional() @Transform(booleanValue) @IsBoolean() prescriptionRequired?: boolean;
  @IsOptional() @Transform(booleanValue) @IsBoolean() includeInactive = false;
  @IsOptional() @Transform(booleanValue) @IsBoolean() includeDeleted = false;
  @IsOptional() @Type(() => Date) @IsDate() createdFrom?: Date;
  @IsOptional() @Type(() => Date) @IsDate() createdTo?: Date;
  @IsOptional() @Type(() => Date) @IsDate() updatedFrom?: Date;
  @IsOptional() @Type(() => Date) @IsDate() updatedTo?: Date;
  @IsOptional() @IsIn(['createdAt', 'updatedAt', 'name', 'sku', 'status', 'productType']) sortBy =
    'createdAt';
  @IsOptional() @IsIn(['asc', 'desc']) sortOrder: 'asc' | 'desc' = 'desc';
}

// * DTO [ProductSearchQueryDto]: Validates minimum-length product search requests.
export class ProductSearchQueryDto extends ProductListQueryDto {
  @IsString() @MinLength(2) override search = '';
  @IsOptional() @Transform(booleanValue) @IsBoolean() exactCodeMatch = false;
}

// * DTO [ReferenceListQueryDto]: Validates shared reference-master list filters.
export class ReferenceListQueryDto extends PageQueryDto {
  @IsOptional() @IsString() @MaxLength(200) search?: string;
  @IsOptional() @Transform(booleanValue) @IsBoolean() isActive?: boolean;
  @IsOptional() @Transform(booleanValue) @IsBoolean() includeDeleted = false;
  @IsOptional() @IsString() sortBy = 'name';
  @IsOptional() @IsIn(['asc', 'desc']) sortOrder: 'asc' | 'desc' = 'asc';
}

// * DTO [ProductRelationshipCreateDto]: Validates related-product creation data.
export class ProductRelationshipCreateDto {
  @IsUUID()
  targetProductId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(32)
  relationshipType!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priority = 0;

  @IsOptional()
  @IsDefined()
  metadataJson: Record<string, unknown> | unknown[] = {};
}

// * DTO [ProductRelationshipUpdateDto]: Validates related-product changes and row version.
export class ProductRelationshipUpdateDto {
  @IsOptional() @IsUUID() targetProductId?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(32) relationshipType?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) priority?: number;
  @IsOptional() @IsDefined() metadataJson?: Record<string, unknown> | unknown[];
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) expectedRowVersion?: number;
}

// * DTO [SubstitutionGroupListQueryDto]: Validates substitution-group discovery filters.
export class SubstitutionGroupListQueryDto extends ReferenceListQueryDto {
  @IsOptional() @IsUUID() dosageFormId?: string;
}

// * DTO [SubstitutionGroupCreateDto]: Validates substitution-group signature creation data.
export class SubstitutionGroupCreateDto {
  @IsString()
  @MinLength(1)
  @MaxLength(512)
  saltSignature!: string;

  @IsOptional()
  @IsUUID()
  dosageFormId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  strengthSignature?: string;

  @IsOptional()
  @IsBoolean()
  isActive = true;
}

// * DTO [SubstitutionGroupUpdateDto]: Validates substitution-group changes and row version.
export class SubstitutionGroupUpdateDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(512) saltSignature?: string;
  @IsOptional() @IsUUID() dosageFormId?: string | null;
  @IsOptional() @IsString() @MaxLength(255) strengthSignature?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) expectedRowVersion?: number;
}

// * DTO [SubstitutionGroupProductCreateDto]: Validates group membership creation data.
export class SubstitutionGroupProductCreateDto {
  @IsUUID()
  productId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priority = 0;
}

// * DTO [SubstitutionGroupProductUpdateDto]: Validates membership priority changes.
export class SubstitutionGroupProductUpdateDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priority!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  expectedRowVersion?: number;
}

// * DTO [BrandCreateDto]: Validates brand reference creation data.
export class BrandCreateDto {
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() @MaxLength(255) slug?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsUUID() logoFileId?: string;
  @IsOptional() @IsUUID() ownerOrganizationId?: string;
  @IsOptional() @IsBoolean() isActive = true;
}
// * DTO [BrandUpdateDto]: Validates brand reference updates.
export class BrandUpdateDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) name?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) slug?: string;
  @IsOptional() @IsString() description?: string | null;
  @IsOptional() @IsUUID() logoFileId?: string | null;
  @IsOptional() @IsUUID() ownerOrganizationId?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

// * DTO [ManufacturerCreateDto]: Validates manufacturer reference creation data.
export class ManufacturerCreateDto {
  @IsOptional() @IsUUID() organizationId?: string;
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() @MaxLength(255) legalName?: string;
  @IsOptional() @IsString() @MaxLength(128) licenseNumber?: string;
  @IsOptional() @IsString() @Matches(/^[A-Za-z]{2}$/) countryCode = 'IN';
  @IsOptional() @IsBoolean() isActive = true;
}
// * DTO [ManufacturerUpdateDto]: Validates manufacturer reference updates.
export class ManufacturerUpdateDto {
  @IsOptional() @IsUUID() organizationId?: string | null;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) name?: string;
  @IsOptional() @IsString() @MaxLength(255) legalName?: string | null;
  @IsOptional() @IsString() @MaxLength(128) licenseNumber?: string | null;
  @IsOptional() @IsString() @Matches(/^[A-Za-z]{2}$/) countryCode?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

// * DTO [CategoryCreateDto]: Validates hierarchical category creation data.
export class CategoryCreateDto {
  @IsOptional() @IsUUID() parentId?: string;
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() @MaxLength(255) slug?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) displayOrder = 0;
  @IsOptional() @IsBoolean() isActive = true;
  @IsOptional() @IsDefined() metadataJson: Record<string, unknown> | unknown[] = {};
}
// * DTO [CategoryUpdateDto]: Validates category edits and hierarchy moves.
export class CategoryUpdateDto {
  @IsOptional() @IsUUID() parentId?: string | null;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) name?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) slug?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) displayOrder?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsDefined() metadataJson?: Record<string, unknown> | unknown[];
}

// * DTO [SaltCreateDto]: Validates salt reference creation data.
export class SaltCreateDto {
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() @MaxLength(64) standardCode?: string;
}
// * DTO [SaltUpdateDto]: Validates salt reference updates.
export class SaltUpdateDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) name?: string;
  @IsOptional() @IsString() description?: string | null;
  @IsOptional() @IsString() @MaxLength(64) standardCode?: string | null;
}

// * DTO [DosageFormCreateDto]: Validates dosage-form reference creation data.
export class DosageFormCreateDto {
  @IsString() @MinLength(1) @MaxLength(64) code!: string;
  @IsString() @MinLength(1) @MaxLength(128) name!: string;
  @IsOptional() @IsString() @MaxLength(64) routeOfAdministration?: string;
  @IsOptional() @IsBoolean() isActive = true;
}
// * DTO [DosageFormUpdateDto]: Validates dosage-form reference updates.
export class DosageFormUpdateDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(64) code?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(128) name?: string;
  @IsOptional() @IsString() @MaxLength(64) routeOfAdministration?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

// * DTO [UnitCreateDto]: Validates unit-of-measure creation data.
export class UnitCreateDto {
  @IsString() @MinLength(1) @MaxLength(32) code!: string;
  @IsString() @MinLength(1) @MaxLength(64) name!: string;
  @IsString() @MinLength(1) @MaxLength(32) dimension!: string;
  @IsOptional() @IsNumberString() conversionToBase = '1';
}
// * DTO [UnitUpdateDto]: Validates unit-of-measure updates.
export class UnitUpdateDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(32) code?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(64) name?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(32) dimension?: string;
  @IsOptional() @IsNumberString() conversionToBase?: string;
}
