// * Catalog module: Exposes reference-master and substitution-group endpoints.
// * File: src/features/references/references.controller.ts
// ? Keep transport concerns here and delegate catalog rules to ReferencesService.
// ! Do not place persistence queries or hierarchy rules in these controllers.
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
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  BrandCreateDto,
  BrandUpdateDto,
  CategoryCreateDto,
  CategoryUpdateDto,
  DosageFormCreateDto,
  DosageFormUpdateDto,
  ManufacturerCreateDto,
  ManufacturerUpdateDto,
  ReferenceListQueryDto,
  SaltCreateDto,
  SaltUpdateDto,
  SubstitutionGroupCreateDto,
  SubstitutionGroupListQueryDto,
  SubstitutionGroupProductCreateDto,
  SubstitutionGroupProductUpdateDto,
  SubstitutionGroupUpdateDto,
  UnitCreateDto,
  UnitUpdateDto,
} from './references.schema';
import { actorId } from '../../contracts/catalog-context';
import {
  ApiCatalogActorHeader,
  ApiCatalogBody,
  ApiCatalogErrors,
  ApiCatalogOperation,
  ApiCatalogQuery,
  ApiCatalogQueryParam,
  ApiCatalogResponse,
  ApiCatalogUuidParam,
} from '../../contracts/swagger';
import { ReferencesService } from './references.service';

@ApiTags('brands')
@Controller({ path: 'brands', version: '1' })
@ApiCatalogErrors()
/** HTTP controller for brand reference operations. */
export class BrandsController {
  constructor(private readonly service: ReferencesService) {}
  /** Lists brands for catalogue filters and administration. */
  @Get()
  @ApiCatalogOperation(
    'List brands',
    'Returns paginated brand master data for filters, catalogue administration, and product authoring.',
  )
  @ApiCatalogQuery(
    ReferenceListQueryDto,
    'Pagination, search, active-state, deletion, and sorting filters.',
  )
  @ApiCatalogResponse('Brands returned.', {
    items: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Acme Pharma',
        slug: 'acme-pharma',
        isActive: true,
      },
    ],
    pagination: { totalCount: 1, limit: 20, offset: 0, hasNext: false },
  })
  list(@Query() query: ReferenceListQueryDto) {
    return this.service.listReferences('brands', query);
  }
  /** Creates a brand reference. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCatalogOperation(
    'Create a brand',
    'Creates a brand reference that can be assigned to products.',
  )
  @ApiCatalogBody(
    BrandCreateDto,
    'Brand name, slug, optional description, logo, and owner organization.',
  )
  @ApiCatalogActorHeader()
  @ApiCatalogResponse(
    'Brand created.',
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Acme Pharma',
      slug: 'acme-pharma',
      isActive: true,
    },
    HttpStatus.CREATED,
  )
  create(@Body() body: BrandCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createReference('brands', body, actorId(user));
  }
  /** Loads one brand reference. */
  @Get(':entityId')
  @ApiCatalogOperation(
    'Get a brand',
    'Loads one brand reference for product forms or administration.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the brand.')
  @ApiCatalogQueryParam('includeDeleted', 'Include the soft-deleted brand.', {
    required: false,
    schema: { type: 'boolean', default: false },
  })
  @ApiCatalogResponse('Brand returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Acme Pharma',
    slug: 'acme-pharma',
    isActive: true,
  })
  get(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getReference('brands', id, deleted === 'true');
  }
  /** Updates one brand reference. */
  @Patch(':entityId')
  @ApiCatalogOperation(
    'Update a brand',
    'Changes the editable brand reference fields used by product catalogue workflows.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the brand.')
  @ApiCatalogBody(BrandUpdateDto, 'Brand fields to change.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Brand updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Acme Pharma',
    isActive: true,
  })
  update(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Body() body: BrandUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateReference('brands', id, body, actorId(user));
  }
  /** Soft-deactivates one brand reference. */
  @Delete(':entityId')
  @ApiCatalogOperation(
    'Deactivate a brand',
    'Soft-deletes a brand so it is no longer offered for new product assignments while preserving history.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the brand.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Brand deactivated.', { message: 'The brand has been deactivated.' })
  remove(@Param('entityId', new ParseUUIDPipe()) id: string, @Headers('x-user-id') user?: string) {
    return this.service.deactivateReference('brands', id, actorId(user));
  }
  /** Reactivates one brand reference. */
  @Post(':entityId/reactivate')
  @ApiCatalogOperation(
    'Reactivate a brand',
    'Restores a previously deactivated brand after duplicate checks.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the brand.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Brand reactivated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Acme Pharma',
    isActive: true,
  })
  reactivate(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateReference('brands', id, actorId(user));
  }
}

@ApiTags('manufacturers')
@Controller({ path: 'manufacturers', version: '1' })
@ApiCatalogErrors()
/** HTTP controller for manufacturer reference operations. */
export class ManufacturersController {
  constructor(private readonly service: ReferencesService) {}
  /** Lists manufacturers for catalogue filters and administration. */
  @Get()
  @ApiCatalogOperation(
    'List manufacturers',
    'Returns paginated manufacturer master data for product authoring, compliance, and catalogue filters.',
  )
  @ApiCatalogQuery(
    ReferenceListQueryDto,
    'Pagination, search, active-state, deletion, and sorting filters.',
  )
  @ApiCatalogResponse('Manufacturers returned.', {
    items: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Acme Labs',
        licenseNumber: 'LIC-001',
        isActive: true,
      },
    ],
    pagination: { totalCount: 1, limit: 20, offset: 0, hasNext: false },
  })
  list(@Query() query: ReferenceListQueryDto) {
    return this.service.listReferences('manufacturers', query);
  }
  /** Creates a manufacturer reference. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCatalogOperation(
    'Create a manufacturer',
    'Creates a manufacturer reference for assignment to products and regulatory catalog data.',
  )
  @ApiCatalogBody(
    ManufacturerCreateDto,
    'Manufacturer organization, name, license, country, and active state.',
  )
  @ApiCatalogActorHeader()
  @ApiCatalogResponse(
    'Manufacturer created.',
    { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Acme Labs', isActive: true },
    HttpStatus.CREATED,
  )
  create(@Body() body: ManufacturerCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createReference('manufacturers', body, actorId(user));
  }
  /** Loads one manufacturer reference. */
  @Get(':entityId')
  @ApiCatalogOperation(
    'Get a manufacturer',
    'Loads one manufacturer reference for product forms or administration.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the manufacturer.')
  @ApiCatalogQueryParam('includeDeleted', 'Include the soft-deleted manufacturer.', {
    required: false,
    schema: { type: 'boolean', default: false },
  })
  @ApiCatalogResponse('Manufacturer returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Acme Labs',
    licenseNumber: 'LIC-001',
    isActive: true,
  })
  get(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getReference('manufacturers', id, deleted === 'true');
  }
  /** Updates one manufacturer reference. */
  @Patch(':entityId')
  @ApiCatalogOperation(
    'Update a manufacturer',
    'Changes the editable manufacturer reference fields used by product and compliance workflows.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the manufacturer.')
  @ApiCatalogBody(ManufacturerUpdateDto, 'Manufacturer fields to change.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Manufacturer updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Acme Labs',
    isActive: true,
  })
  update(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Body() body: ManufacturerUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateReference('manufacturers', id, body, actorId(user));
  }
  /** Soft-deactivates one manufacturer reference. */
  @Delete(':entityId')
  @ApiCatalogOperation(
    'Deactivate a manufacturer',
    'Soft-deletes a manufacturer so it cannot be newly assigned while retaining product history.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the manufacturer.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Manufacturer deactivated.', {
    message: 'The manufacturer has been deactivated.',
  })
  remove(@Param('entityId', new ParseUUIDPipe()) id: string, @Headers('x-user-id') user?: string) {
    return this.service.deactivateReference('manufacturers', id, actorId(user));
  }
  /** Reactivates one manufacturer reference. */
  @Post(':entityId/reactivate')
  @ApiCatalogOperation(
    'Reactivate a manufacturer',
    'Restores a previously deactivated manufacturer after duplicate checks.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the manufacturer.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Manufacturer reactivated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Acme Labs',
    isActive: true,
  })
  reactivate(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateReference('manufacturers', id, actorId(user));
  }
}

@ApiTags('categories')
@Controller({ path: 'categories', version: '1' })
@ApiCatalogErrors()
/** HTTP controller for hierarchical category operations. */
export class CategoriesController {
  constructor(private readonly service: ReferencesService) {}
  /** Lists categories in paginated form. */
  @Get()
  @ApiCatalogOperation(
    'List categories',
    'Returns paginated product categories for catalogue navigation and product assignment.',
  )
  @ApiCatalogQuery(
    ReferenceListQueryDto,
    'Pagination, search, active-state, deletion, and sorting filters.',
  )
  @ApiCatalogResponse('Categories returned.', {
    items: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Pain relief',
        path: 'pain-relief',
        level: 0,
        isActive: true,
      },
    ],
    pagination: { totalCount: 1, limit: 20, offset: 0, hasNext: false },
  })
  list(@Query() query: ReferenceListQueryDto) {
    return this.service.listReferences('categories', query);
  }
  /** Returns nested category navigation data. */
  @Get('tree')
  @ApiCatalogOperation(
    'Get the category tree',
    'Returns nested category navigation data. Set `includeInactive=true` for catalogue administration; storefront navigation normally uses active categories only.',
  )
  @ApiCatalogQueryParam('includeInactive', 'Include inactive category nodes.', {
    required: false,
    schema: { type: 'boolean', default: false },
  })
  @ApiCatalogResponse('Category tree returned.', {
    items: [{ id: '550e8400-e29b-41d4-a716-446655440000', name: 'Pain relief', children: [] }],
  })
  tree(@Query('includeInactive') inactive?: string) {
    return this.service.categoryTree(inactive === 'true');
  }
  /** Creates a category and derives its hierarchy path. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCatalogOperation(
    'Create a category',
    'Creates a category and calculates its hierarchy path and level from the optional parent.',
  )
  @ApiCatalogBody(
    CategoryCreateDto,
    'Category name, optional parent, ordering, active state, and metadata.',
  )
  @ApiCatalogActorHeader()
  @ApiCatalogResponse(
    'Category created.',
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Pain relief',
      path: 'pain-relief',
      level: 0,
      isActive: true,
    },
    HttpStatus.CREATED,
  )
  create(@Body() body: CategoryCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createReference('categories', body, actorId(user));
  }
  /** Loads one category reference. */
  @Get(':entityId')
  @ApiCatalogOperation(
    'Get a category',
    'Loads one category including hierarchy information for product forms or administration.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the category.')
  @ApiCatalogQueryParam('includeDeleted', 'Include the soft-deleted category.', {
    required: false,
    schema: { type: 'boolean', default: false },
  })
  @ApiCatalogResponse('Category returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Pain relief',
    path: 'pain-relief',
    level: 0,
    isActive: true,
  })
  get(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getReference('categories', id, deleted === 'true');
  }
  /** Updates or moves one category in the hierarchy. */
  @Patch(':entityId')
  @ApiCatalogOperation(
    'Update a category',
    'Changes category details or moves the category to another valid parent while preserving descendant paths.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the category.')
  @ApiCatalogBody(
    CategoryUpdateDto,
    'Category fields to change, including optional parent and metadata.',
  )
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Category updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Pain relief',
    path: 'pain-relief',
    level: 0,
  })
  update(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Body() body: CategoryUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateReference('categories', id, body, actorId(user));
  }
  /** Soft-deactivates a category after descendant checks. */
  @Delete(':entityId')
  @ApiCatalogOperation(
    'Deactivate a category',
    'Soft-deletes a category after ensuring it has no active descendants.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the category.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Category deactivated.', { message: 'The category has been deactivated.' })
  remove(@Param('entityId', new ParseUUIDPipe()) id: string, @Headers('x-user-id') user?: string) {
    return this.service.deactivateReference('categories', id, actorId(user));
  }
  /** Reactivates one category after parent and slug checks. */
  @Post(':entityId/reactivate')
  @ApiCatalogOperation(
    'Reactivate a category',
    'Restores a category after checking its slug and parent hierarchy are still valid.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the category.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Category reactivated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Pain relief',
    isActive: true,
  })
  reactivate(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateReference('categories', id, actorId(user));
  }
}

@ApiTags('salts')
@Controller({ path: 'salts', version: '1' })
@ApiCatalogErrors()
/** HTTP controller for active-ingredient salt references. */
export class SaltsController {
  constructor(private readonly service: ReferencesService) {}
  /** Lists salts used in product composition. */
  @Get()
  @ApiCatalogOperation(
    'List salts',
    'Returns paginated active-ingredient salt data used for product composition and medicine substitution.',
  )
  @ApiCatalogQuery(ReferenceListQueryDto, 'Pagination, search, deletion, and sorting filters.')
  @ApiCatalogResponse('Salts returned.', {
    items: [
      { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Paracetamol', standardCode: 'PCM' },
    ],
    pagination: { totalCount: 1, limit: 20, offset: 0, hasNext: false },
  })
  list(@Query() query: ReferenceListQueryDto) {
    return this.service.listReferences('salts', query);
  }
  /** Creates a salt reference. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCatalogOperation(
    'Create a salt',
    'Creates an active-ingredient reference for product composition and substitution-group signatures.',
  )
  @ApiCatalogBody(SaltCreateDto, 'Salt name, description, and optional standard code.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse(
    'Salt created.',
    { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Paracetamol', standardCode: 'PCM' },
    HttpStatus.CREATED,
  )
  create(@Body() body: SaltCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createReference('salts', body, actorId(user));
  }
  /** Loads one salt reference. */
  @Get(':entityId')
  @ApiCatalogOperation(
    'Get a salt',
    'Loads one active-ingredient reference for product detail and composition workflows.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the salt.')
  @ApiCatalogQueryParam('includeDeleted', 'Include the soft-deleted salt.', {
    required: false,
    schema: { type: 'boolean', default: false },
  })
  @ApiCatalogResponse('Salt returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Paracetamol',
    standardCode: 'PCM',
  })
  get(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getReference('salts', id, deleted === 'true');
  }
  /** Updates one salt reference. */
  @Patch(':entityId')
  @ApiCatalogOperation(
    'Update a salt',
    'Changes a salt name, description, or standard code while preserving product composition references.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the salt.')
  @ApiCatalogBody(SaltUpdateDto, 'Salt fields to change.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Salt updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Paracetamol',
    standardCode: 'PCM',
  })
  update(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Body() body: SaltUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateReference('salts', id, body, actorId(user));
  }
  /** Soft-deactivates one salt reference. */
  @Delete(':entityId')
  @ApiCatalogOperation(
    'Deactivate a salt',
    'Soft-deletes a salt so it cannot be newly selected while preserving existing product history.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the salt.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Salt deactivated.', { message: 'The salt has been deactivated.' })
  remove(@Param('entityId', new ParseUUIDPipe()) id: string, @Headers('x-user-id') user?: string) {
    return this.service.deactivateReference('salts', id, actorId(user));
  }
  /** Reactivates one salt reference. */
  @Post(':entityId/reactivate')
  @ApiCatalogOperation('Reactivate a salt', 'Restores a previously deactivated salt reference.')
  @ApiCatalogUuidParam('entityId', 'UUID of the salt.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Salt reactivated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Paracetamol',
  })
  reactivate(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateReference('salts', id, actorId(user));
  }
}

@ApiTags('dosage-forms')
@Controller({ path: 'dosage-forms', version: '1' })
@ApiCatalogErrors()
/** HTTP controller for dosage-form references. */
export class DosageFormsController {
  constructor(private readonly service: ReferencesService) {}
  /** Lists dosage forms used by product records and filters. */
  @Get()
  @ApiCatalogOperation(
    'List dosage forms',
    'Returns dosage-form references used to describe how a product is administered and to filter catalogue results.',
  )
  @ApiCatalogQuery(
    ReferenceListQueryDto,
    'Pagination, search, active-state, deletion, and sorting filters.',
  )
  @ApiCatalogResponse('Dosage forms returned.', {
    items: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        code: 'TAB',
        name: 'Tablet',
        routeOfAdministration: 'oral',
        isActive: true,
      },
    ],
    pagination: { totalCount: 1, limit: 20, offset: 0, hasNext: false },
  })
  list(@Query() query: ReferenceListQueryDto) {
    return this.service.listReferences('dosage-forms', query);
  }
  /** Creates a dosage-form reference. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCatalogOperation(
    'Create a dosage form',
    'Creates a dosage-form reference for product authoring and substitution-group matching.',
  )
  @ApiCatalogBody(
    DosageFormCreateDto,
    'Dosage-form code, name, route of administration, and active state.',
  )
  @ApiCatalogActorHeader()
  @ApiCatalogResponse(
    'Dosage form created.',
    { id: '550e8400-e29b-41d4-a716-446655440000', code: 'TAB', name: 'Tablet', isActive: true },
    HttpStatus.CREATED,
  )
  create(@Body() body: DosageFormCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createReference('dosage-forms', body, actorId(user));
  }
  /** Loads one dosage-form reference. */
  @Get(':entityId')
  @ApiCatalogOperation(
    'Get a dosage form',
    'Loads one dosage-form reference for product detail and filters.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the dosage form.')
  @ApiCatalogQueryParam('includeDeleted', 'Include the soft-deleted dosage form.', {
    required: false,
    schema: { type: 'boolean', default: false },
  })
  @ApiCatalogResponse('Dosage form returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    code: 'TAB',
    name: 'Tablet',
    isActive: true,
  })
  get(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getReference('dosage-forms', id, deleted === 'true');
  }
  /** Updates one dosage-form reference. */
  @Patch(':entityId')
  @ApiCatalogOperation('Update a dosage form', 'Changes the editable dosage-form reference fields.')
  @ApiCatalogUuidParam('entityId', 'UUID of the dosage form.')
  @ApiCatalogBody(DosageFormUpdateDto, 'Dosage-form fields to change.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Dosage form updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    code: 'TAB',
    name: 'Tablet',
    isActive: true,
  })
  update(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Body() body: DosageFormUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateReference('dosage-forms', id, body, actorId(user));
  }
  /** Soft-deactivates one dosage-form reference. */
  @Delete(':entityId')
  @ApiCatalogOperation(
    'Deactivate a dosage form',
    'Soft-deletes a dosage form so it cannot be newly assigned to products.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the dosage form.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Dosage form deactivated.', {
    message: 'The dosage form has been deactivated.',
  })
  remove(@Param('entityId', new ParseUUIDPipe()) id: string, @Headers('x-user-id') user?: string) {
    return this.service.deactivateReference('dosage-forms', id, actorId(user));
  }
  /** Reactivates one dosage-form reference. */
  @Post(':entityId/reactivate')
  @ApiCatalogOperation(
    'Reactivate a dosage form',
    'Restores a previously deactivated dosage-form reference.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the dosage form.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Dosage form reactivated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    code: 'TAB',
    name: 'Tablet',
    isActive: true,
  })
  reactivate(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateReference('dosage-forms', id, actorId(user));
  }
}

@ApiTags('units')
@Controller({ path: 'units', version: '1' })
@ApiCatalogErrors()
/** HTTP controller for units-of-measure references. */
export class UnitsController {
  constructor(private readonly service: ReferencesService) {}
  /** Lists units used by product variant pack quantities. */
  @Get()
  @ApiCatalogOperation(
    'List units of measure',
    'Returns units used for product pack quantities and other catalogue measurements.',
  )
  @ApiCatalogQuery(ReferenceListQueryDto, 'Pagination, search, deletion, and sorting filters.')
  @ApiCatalogResponse('Units returned.', {
    items: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        code: 'TAB',
        name: 'Tablet',
        dimension: 'count',
        conversionToBase: '1',
      },
    ],
    pagination: { totalCount: 1, limit: 20, offset: 0, hasNext: false },
  })
  list(@Query() query: ReferenceListQueryDto) {
    return this.service.listReferences('units', query);
  }
  /** Creates a unit-of-measure reference. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCatalogOperation(
    'Create a unit of measure',
    'Creates a unit reference used by product variants for pack quantities.',
  )
  @ApiCatalogBody(UnitCreateDto, 'Unit code, name, dimension, and conversion factor.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse(
    'Unit created.',
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      code: 'TAB',
      name: 'Tablet',
      dimension: 'count',
      conversionToBase: '1',
    },
    HttpStatus.CREATED,
  )
  create(@Body() body: UnitCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createReference('units', body, actorId(user));
  }
  /** Loads one unit-of-measure reference. */
  @Get(':entityId')
  @ApiCatalogOperation(
    'Get a unit of measure',
    'Loads one unit reference for variant pack-size forms and administration.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the unit.')
  @ApiCatalogQueryParam('includeDeleted', 'Include the soft-deleted unit.', {
    required: false,
    schema: { type: 'boolean', default: false },
  })
  @ApiCatalogResponse('Unit returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    code: 'TAB',
    name: 'Tablet',
    dimension: 'count',
    conversionToBase: '1',
  })
  get(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getReference('units', id, deleted === 'true');
  }
  /** Updates one unit-of-measure reference. */
  @Patch(':entityId')
  @ApiCatalogOperation(
    'Update a unit of measure',
    'Changes the editable unit reference fields. Conversion factors must remain positive.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the unit.')
  @ApiCatalogBody(UnitUpdateDto, 'Unit fields to change.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Unit updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    code: 'TAB',
    name: 'Tablet',
    dimension: 'count',
    conversionToBase: '1',
  })
  update(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Body() body: UnitUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateReference('units', id, body, actorId(user));
  }
  /** Soft-deactivates one unit-of-measure reference. */
  @Delete(':entityId')
  @ApiCatalogOperation(
    'Deactivate a unit of measure',
    'Soft-deletes a unit so it cannot be newly assigned to variants.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the unit.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Unit deactivated.', { message: 'The unit has been deactivated.' })
  remove(@Param('entityId', new ParseUUIDPipe()) id: string, @Headers('x-user-id') user?: string) {
    return this.service.deactivateReference('units', id, actorId(user));
  }
  /** Reactivates one unit-of-measure reference. */
  @Post(':entityId/reactivate')
  @ApiCatalogOperation(
    'Reactivate a unit of measure',
    'Restores a previously deactivated unit reference.',
  )
  @ApiCatalogUuidParam('entityId', 'UUID of the unit.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Unit reactivated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    code: 'TAB',
    name: 'Tablet',
    dimension: 'count',
    conversionToBase: '1',
  })
  reactivate(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateReference('units', id, actorId(user));
  }
}

@ApiTags('substitution-groups')
@Controller({ path: 'substitution-groups', version: '1' })
@ApiCatalogErrors()
/** HTTP controller for substitution-group signatures and memberships. */
export class SubstitutionGroupsController {
  constructor(private readonly service: ReferencesService) {}

  /** Lists substitution-group signatures. */
  @Get()
  @ApiCatalogOperation(
    'List substitution groups',
    'Returns medicine substitution groups identified by salt, dosage form, and strength signatures. Use this for pharmacist-approved alternative management.',
  )
  @ApiCatalogQuery(
    SubstitutionGroupListQueryDto,
    'Pagination, signature search, dosage-form, active-state, deletion, and sorting filters.',
  )
  @ApiCatalogResponse('Substitution groups returned.', {
    items: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        saltSignature: 'paracetamol',
        dosageFormId: '550e8400-e29b-41d4-a716-446655440001',
        strengthSignature: '500mg',
        isActive: true,
      },
    ],
    pagination: { totalCount: 1, limit: 20, offset: 0, hasNext: false },
  })
  list(@Query() query: SubstitutionGroupListQueryDto) {
    return this.service.listSubstitutionGroups(query);
  }

  /** Creates a substitution-group signature. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCatalogOperation(
    'Create a substitution group',
    'Creates a substitution-group signature that can contain products with equivalent active ingredients, dosage form, and strength.',
  )
  @ApiCatalogBody(
    SubstitutionGroupCreateDto,
    'Salt signature, optional dosage form and strength signatures, and active state.',
  )
  @ApiCatalogActorHeader()
  @ApiCatalogResponse(
    'Substitution group created.',
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      saltSignature: 'paracetamol',
      strengthSignature: '500mg',
      isActive: true,
    },
    HttpStatus.CREATED,
  )
  create(@Body() body: SubstitutionGroupCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createSubstitutionGroup(body, actorId(user));
  }

  /** Lists products assigned to a substitution group. */
  @Get(':groupId/products')
  @ApiCatalogOperation(
    'List substitution-group products',
    'Returns products assigned to a substitution group in priority order for alternative-product selection.',
  )
  @ApiCatalogUuidParam('groupId', 'UUID of the substitution group.')
  @ApiCatalogResponse('Substitution-group products returned.', {
    items: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        productId: '550e8400-e29b-41d4-a716-446655440001',
        priority: 1,
        sku: 'PARA-500',
      },
    ],
  })
  products(@Param('groupId', new ParseUUIDPipe()) groupId: string) {
    return this.service.listSubstitutionGroupProducts(groupId);
  }

  /** Adds a product to a substitution group. */
  @Post(':groupId/products')
  @HttpCode(HttpStatus.CREATED)
  @ApiCatalogOperation(
    'Add a product to a substitution group',
    'Associates a product with a substitution group so it can be offered as an alternative.',
  )
  @ApiCatalogUuidParam('groupId', 'UUID of the substitution group.')
  @ApiCatalogBody(SubstitutionGroupProductCreateDto, 'Product UUID and display priority.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse(
    'Product added to substitution group.',
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      groupId: '550e8400-e29b-41d4-a716-446655440000',
      productId: '550e8400-e29b-41d4-a716-446655440001',
      priority: 1,
    },
    HttpStatus.CREATED,
  )
  addProduct(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Body() body: SubstitutionGroupProductCreateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.addSubstitutionGroupProduct(groupId, body, actorId(user));
  }

  /** Updates a substitution-group membership priority. */
  @Patch(':groupId/products/:productId')
  @ApiCatalogOperation(
    'Update substitution-group product priority',
    'Changes the ordering priority of a product within a substitution group. Use `expectedRowVersion` for concurrent administration edits.',
  )
  @ApiCatalogUuidParam('groupId', 'UUID of the substitution group.')
  @ApiCatalogUuidParam('productId', 'UUID of the member product.')
  @ApiCatalogBody(
    SubstitutionGroupProductUpdateDto,
    'New priority and optional optimistic-concurrency version.',
  )
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Substitution-group product updated.', {
    productId: '550e8400-e29b-41d4-a716-446655440001',
    priority: 1,
  })
  updateProduct(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() body: SubstitutionGroupProductUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateSubstitutionGroupProduct(groupId, productId, body, actorId(user));
  }

  /** Removes a product from a substitution group. */
  @Delete(':groupId/products/:productId')
  @ApiCatalogOperation(
    'Remove a product from a substitution group',
    'Removes one product membership so it is no longer returned as an alternative from that group.',
  )
  @ApiCatalogUuidParam('groupId', 'UUID of the substitution group.')
  @ApiCatalogUuidParam('productId', 'UUID of the member product.')
  @ApiCatalogResponse('Product removed from substitution group.', {
    message: 'The product has been removed from the substitution group.',
  })
  removeProduct(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.service.removeSubstitutionGroupProduct(groupId, productId);
  }

  /** Loads one substitution-group signature. */
  @Get(':groupId')
  @ApiCatalogOperation(
    'Get a substitution group',
    'Loads one substitution-group signature for administration or alternative-product configuration.',
  )
  @ApiCatalogUuidParam('groupId', 'UUID of the substitution group.')
  @ApiCatalogQueryParam('includeDeleted', 'Include the soft-deleted substitution group.', {
    required: false,
    schema: { type: 'boolean', default: false },
  })
  @ApiCatalogResponse('Substitution group returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    saltSignature: 'paracetamol',
    strengthSignature: '500mg',
    isActive: true,
  })
  get(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getSubstitutionGroup(groupId, deleted === 'true');
  }

  /** Updates a substitution-group signature. */
  @Patch(':groupId')
  @ApiCatalogOperation(
    'Update a substitution group',
    'Changes the signature or active state of a substitution group. Use `expectedRowVersion` for concurrent administration edits.',
  )
  @ApiCatalogUuidParam('groupId', 'UUID of the substitution group.')
  @ApiCatalogBody(
    SubstitutionGroupUpdateDto,
    'Substitution-group fields to change and optional optimistic-concurrency version.',
  )
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Substitution group updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    saltSignature: 'paracetamol',
    strengthSignature: '500mg',
    isActive: true,
  })
  update(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Body() body: SubstitutionGroupUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateSubstitutionGroup(groupId, body, actorId(user));
  }

  /** Soft-deactivates a substitution group. */
  @Delete(':groupId')
  @ApiCatalogOperation(
    'Deactivate a substitution group',
    'Soft-deletes a substitution group so it is not used for new alternative-product responses.',
  )
  @ApiCatalogUuidParam('groupId', 'UUID of the substitution group.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Substitution group deactivated.', {
    message: 'The substitution group has been deactivated.',
  })
  remove(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.deactivateSubstitutionGroup(groupId, actorId(user));
  }

  /** Reactivates a substitution group. */
  @Post(':groupId/reactivate')
  @ApiCatalogOperation(
    'Reactivate a substitution group',
    'Restores a previously deactivated substitution group.',
  )
  @ApiCatalogUuidParam('groupId', 'UUID of the substitution group.')
  @ApiCatalogActorHeader()
  @ApiCatalogResponse('Substitution group reactivated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    saltSignature: 'paracetamol',
    isActive: true,
  })
  reactivate(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateSubstitutionGroup(groupId, actorId(user));
  }
}
