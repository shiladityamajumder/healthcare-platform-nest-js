// * Catalog module: Exposes product, relationship, and substitution lookup endpoints.
// * File: src/features/products/products.controller.ts
// ? Keep HTTP concerns in the controller and delegate validation/workflows to ProductsService.
// ! Do not place SQL or product business rules in this transport boundary.
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  BulkProductStatusDto,
  CreateProductDto,
  ProductListQueryDto,
  ProductRelationshipCreateDto,
  ProductRelationshipUpdateDto,
  ProductSearchQueryDto,
  ReplaceProductDetailsDto,
  UpdateProductDto,
} from './products.schema';
import { actorId } from '../../contracts/catalog-context';
import {
  ApiCatalogActorHeader,
  ApiCatalogBody,
  ApiCatalogErrors,
  ApiCatalogOperation,
  ApiCatalogQuery,
  ApiCatalogQueryParam,
  ApiCatalogResponse,
  ApiCatalogStringParam,
  ApiCatalogUuidParam,
} from '../../contracts/swagger';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller({ path: 'products', version: '1' })
@ApiCatalogErrors()
/** HTTP controller for product catalogue operations. */
export class ProductsController {
  public constructor(private readonly service: ProductsService) {}

  /** Lists product summaries for catalogue browsing and administration. */
  @Get()
  @ApiCatalogOperation(
    'List products',
    'Returns a paginated product catalogue for browsing, administration, category pages, and product discovery. Use `dosageFormId` or `saltId` to narrow healthcare product results; availability is not calculated by this catalog endpoint.',
  )
  @ApiCatalogQuery(
    ProductListQueryDto,
    'Pagination, lifecycle, reference, date, and search filters.',
  )
  @ApiCatalogResponse('Products returned.', {
    items: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        sku: 'PARA-500',
        name: 'Paracetamol 500 mg',
        status: 'active',
      },
    ],
    pagination: { totalCount: 1, limit: 20, offset: 0, hasNext: false },
  })
  list(@Query() query: ProductListQueryDto) {
    return this.service.listProducts(query);
  }

  /** Searches the product catalogue using the supported discovery fields. */
  @Get('search')
  @ApiCatalogOperation(
    'Search products',
    'Searches product names, SKUs, slugs, identifiers, salts, content, and catalogue reference names. Use `exactCodeMatch=true` for barcode/SKU-style lookup.',
  )
  @ApiCatalogQuery(
    ProductSearchQueryDto,
    'Search term and optional exact-code, lifecycle, and reference filters.',
  )
  @ApiCatalogResponse('Matching products returned.', {
    items: [
      { id: '550e8400-e29b-41d4-a716-446655440000', sku: 'PARA-500', name: 'Paracetamol 500 mg' },
    ],
    pagination: { totalCount: 1, limit: 20, offset: 0, hasNext: false },
  })
  search(@Query() query: ProductSearchQueryDto) {
    return this.service.searchProducts(query);
  }

  /** Loads a complete product aggregate by SKU or slug. */
  @Get('by-code/:value')
  @ApiCatalogOperation(
    'Get a product by code',
    'Loads the complete product aggregate using its SKU or URL slug. Use this for product detail pages when the code is already known.',
  )
  @ApiCatalogStringParam('value', 'Product SKU or URL slug.', 'PARA-500')
  @ApiCatalogResponse('Product aggregate returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    sku: 'PARA-500',
    name: 'Paracetamol 500 mg',
    variants: [],
    identifiers: [],
    salts: [],
    attributes: [],
    content: [],
    media: [],
    regulatory: null,
  })
  byCode(@Param('value') value: string) {
    return this.service.getProductByCode(value);
  }

  /** Creates a product master and its supplied child collections. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCatalogOperation(
    'Create a product',
    'Creates the product master and its supplied variants, identifiers, salts, attributes, localized content, media, and regulatory details in one catalog transaction.',
  )
  @ApiCatalogBody(CreateProductDto, 'Product master data and optional child collections.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse(
    'Product created.',
    { id: '550e8400-e29b-41d4-a716-446655440000', sku: 'PARA-500', status: 'draft' },
    HttpStatus.CREATED,
  )
  create(@Body() input: CreateProductDto, @Headers('x-user-id') userId?: string) {
    return this.service.createProduct(input, actorId(userId));
  }

  /** Applies a lifecycle status transition to multiple products. */
  @Patch('bulk-status')
  @ApiCatalogOperation(
    'Bulk update product status',
    'Changes the lifecycle status of multiple products after validating each status transition. Use this for catalogue operations screens and controlled publish/deactivate workflows.',
  )
  @ApiCatalogBody(BulkProductStatusDto, 'Product UUIDs and the target lifecycle status.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Product statuses updated.', {
    updatedCount: 2,
    productIds: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  bulkStatus(@Body() input: BulkProductStatusDto, @Headers('x-user-id') userId?: string) {
    return this.service.bulkProductStatus(input, actorId(userId));
  }

  /** Lists directed related-product links for a source product. */
  @Get(':productId/relationships')
  @ApiCatalogOperation(
    'List product relationships',
    'Returns directed related-product links such as alternatives, accessories, bundles, or cross-sell products configured for the source product.',
  )
  @ApiCatalogUuidParam('productId', 'UUID of the source product.')
  @ApiCatalogQueryParam(
    'relationshipType',
    'Optional relationship type filter, for example `alternative` or `accessory`.',
    { required: false, schema: { type: 'string', maxLength: 32, example: 'alternative' } },
  )
  @ApiCatalogResponse('Product relationships returned.', {
    items: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        targetProductId: '550e8400-e29b-41d4-a716-446655440001',
        relationshipType: 'alternative',
        priority: 1,
      },
    ],
  })
  relationships(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Query('relationshipType') relationshipType?: string,
  ) {
    return this.service.listProductRelationships(productId, relationshipType);
  }

  /** Loads one related-product link for administration. */
  @Get(':productId/relationships/:relationshipId')
  @ApiCatalogOperation(
    'Get a product relationship',
    'Loads one configured relationship for a product so an administration screen can edit or inspect it.',
  )
  @ApiCatalogUuidParam('productId', 'UUID of the source product.')
  @ApiCatalogUuidParam('relationshipId', 'UUID of the product relationship.')
  @ApiCatalogResponse('Product relationship returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    relationshipType: 'alternative',
    priority: 1,
    metadataJson: {},
  })
  relationship(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Param('relationshipId', new ParseUUIDPipe()) relationshipId: string,
  ) {
    return this.service.getProductRelationship(productId, relationshipId);
  }

  /** Creates a directed related-product link. */
  @Post(':productId/relationships')
  @HttpCode(HttpStatus.CREATED)
  @ApiCatalogOperation(
    'Create a product relationship',
    'Creates a directed relationship from the source product to another product for related-product and merchandising experiences.',
  )
  @ApiCatalogUuidParam('productId', 'UUID of the source product.')
  @ApiCatalogBody(
    ProductRelationshipCreateDto,
    'Target product, relationship type, ordering priority, and optional metadata.',
  )
  @ApiCatalogActorHeader()
  @ApiCatalogResponse(
    'Product relationship created.',
    { id: '550e8400-e29b-41d4-a716-446655440000', relationshipType: 'alternative', priority: 1 },
    HttpStatus.CREATED,
  )
  createRelationship(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() input: ProductRelationshipCreateDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.service.createProductRelationship(productId, input, actorId(userId));
  }

  /** Updates a directed related-product link with optional row-version protection. */
  @Patch(':productId/relationships/:relationshipId')
  @ApiCatalogOperation(
    'Update a product relationship',
    'Changes the target, relationship type, priority, or metadata of an existing product relationship. Use `expectedRowVersion` to protect concurrent admin edits.',
  )
  @ApiCatalogUuidParam('productId', 'UUID of the source product.')
  @ApiCatalogUuidParam('relationshipId', 'UUID of the product relationship.')
  @ApiCatalogBody(
    ProductRelationshipUpdateDto,
    'Fields to change and optional optimistic-concurrency version.',
  )
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Product relationship updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    relationshipType: 'accessory',
    priority: 2,
  })
  updateRelationship(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Param('relationshipId', new ParseUUIDPipe()) relationshipId: string,
    @Body() input: ProductRelationshipUpdateDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.service.updateProductRelationship(
      productId,
      relationshipId,
      input,
      actorId(userId),
    );
  }

  /** Removes a directed related-product link. */
  @Delete(':productId/relationships/:relationshipId')
  @ApiCatalogOperation(
    'Remove a product relationship',
    'Removes a directed related-product link so it no longer appears in catalogue recommendations.',
  )
  @ApiCatalogUuidParam('productId', 'UUID of the source product.')
  @ApiCatalogUuidParam('relationshipId', 'UUID of the product relationship.')
  @ApiCatalogResponse('Product relationship removed.', {
    message: 'The product relationship has been removed.',
  })
  deleteRelationship(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Param('relationshipId', new ParseUUIDPipe()) relationshipId: string,
  ) {
    return this.service.deleteProductRelationship(productId, relationshipId);
  }

  /** Lists substitution groups containing the product. */
  @Get(':productId/substitution-groups')
  @ApiCatalogOperation(
    'List substitution groups for a product',
    'Returns medicine substitution groups containing the product. Use this to present pharmacist-approved alternative products.',
  )
  @ApiCatalogUuidParam('productId', 'UUID of the product.')
  @ApiCatalogResponse('Substitution groups returned.', {
    items: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        saltSignature: 'paracetamol',
        strengthSignature: '500mg',
        productPriority: 1,
      },
    ],
  })
  substitutionGroups(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return this.service.listProductSubstitutionGroups(productId);
  }

  /** Loads one product aggregate by UUID. */
  @Get(':productId')
  @ApiCatalogOperation(
    'Get a product',
    'Loads a complete product aggregate for the product detail page or catalogue administration. Set `includeDeleted=true` only for recovery or audit views.',
  )
  @ApiCatalogUuidParam('productId', 'UUID of the product.')
  @ApiCatalogQueryParam('includeDeleted', 'Include a soft-deleted product in the result.', {
    required: false,
    schema: { type: 'boolean', default: false, example: false },
  })
  @ApiCatalogResponse('Product aggregate returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    sku: 'PARA-500',
    name: 'Paracetamol 500 mg',
    variants: [],
    identifiers: [],
    salts: [],
    attributes: [],
    content: [],
    media: [],
    regulatory: null,
  })
  get(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    return this.service.getProduct(productId, includeDeleted === 'true');
  }

  /** Updates product master fields. */
  @Patch(':productId')
  @ApiCatalogOperation(
    'Update product master data',
    'Updates product-level fields such as name, references, prescription flags, return policy, search keywords, or lifecycle status. Use `expectedRowVersion` for concurrent edits.',
  )
  @ApiCatalogUuidParam('productId', 'UUID of the product.')
  @ApiCatalogBody(
    UpdateProductDto,
    'Product master fields to change and optional optimistic-concurrency version.',
  )
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Product updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    sku: 'PARA-500',
    status: 'active',
  })
  update(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() input: UpdateProductDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.service.updateProduct(productId, input, actorId(userId));
  }

  /** Replaces the supplied product detail collections. */
  @Put(':productId/details')
  @ApiCatalogOperation(
    'Replace product detail collections',
    'Replaces supplied child collections such as variants, identifiers, salts, attributes, content, media, or regulatory data. Send only collections that should be replaced.',
  )
  @ApiCatalogUuidParam('productId', 'UUID of the product.')
  @ApiCatalogBody(ReplaceProductDetailsDto, 'One or more complete child collections to replace.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Product details replaced.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    variants: [],
    identifiers: [],
    salts: [],
    attributes: [],
    content: [],
    media: [],
    regulatory: null,
  })
  replaceDetails(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() input: ReplaceProductDetailsDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.service.replaceProductDetails(productId, input, actorId(userId));
  }

  /** Soft-deactivates a product from normal catalogue visibility. */
  @Delete(':productId')
  @ApiCatalogOperation(
    'Deactivate a product',
    'Soft-deletes and marks a product inactive so it is excluded from normal catalogue browsing while preserving it for audit and possible restoration.',
  )
  @ApiCatalogUuidParam('productId', 'UUID of the product.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Product deactivated.', { message: 'The product has been deactivated.' })
  deactivate(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.service.deactivateProduct(productId, actorId(userId));
  }

  /** Restores a previously deactivated product. */
  @Post(':productId/reactivate')
  @ApiCatalogOperation(
    'Reactivate a product',
    'Restores a previously deactivated product after checking that its SKU and slug are still available.',
  )
  @ApiCatalogUuidParam('productId', 'UUID of the product.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Product reactivated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    sku: 'PARA-500',
    status: 'inactive',
  })
  reactivate(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.service.reactivateProduct(productId, actorId(userId));
  }
}
