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
import { ReferencesService } from './references.service';

@ApiTags('brands')
@Controller({ path: 'brands', version: '1' })
export class BrandsController {
  constructor(private readonly service: ReferencesService) {}
  @Get() list(@Query() query: ReferenceListQueryDto) {
    return this.service.listReferences('brands', query);
  }
  @Post() @HttpCode(HttpStatus.CREATED) create(
    @Body() body: BrandCreateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.createReference('brands', body, actorId(user));
  }
  @Get(':entityId') get(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getReference('brands', id, deleted === 'true');
  }
  @Patch(':entityId') update(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Body() body: BrandUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateReference('brands', id, body, actorId(user));
  }
  @Delete(':entityId') remove(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.deactivateReference('brands', id, actorId(user));
  }
  @Post(':entityId/reactivate') reactivate(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateReference('brands', id, actorId(user));
  }
}

@ApiTags('manufacturers')
@Controller({ path: 'manufacturers', version: '1' })
export class ManufacturersController {
  constructor(private readonly service: ReferencesService) {}
  @Get() list(@Query() query: ReferenceListQueryDto) {
    return this.service.listReferences('manufacturers', query);
  }
  @Post() @HttpCode(HttpStatus.CREATED) create(
    @Body() body: ManufacturerCreateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.createReference('manufacturers', body, actorId(user));
  }
  @Get(':entityId') get(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getReference('manufacturers', id, deleted === 'true');
  }
  @Patch(':entityId') update(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Body() body: ManufacturerUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateReference('manufacturers', id, body, actorId(user));
  }
  @Delete(':entityId') remove(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.deactivateReference('manufacturers', id, actorId(user));
  }
  @Post(':entityId/reactivate') reactivate(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateReference('manufacturers', id, actorId(user));
  }
}

@ApiTags('categories')
@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
  constructor(private readonly service: ReferencesService) {}
  @Get() list(@Query() query: ReferenceListQueryDto) {
    return this.service.listReferences('categories', query);
  }
  @Get('tree') tree(@Query('includeInactive') inactive?: string) {
    return this.service.categoryTree(inactive === 'true');
  }
  @Post() @HttpCode(HttpStatus.CREATED) create(
    @Body() body: CategoryCreateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.createReference('categories', body, actorId(user));
  }
  @Get(':entityId') get(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getReference('categories', id, deleted === 'true');
  }
  @Patch(':entityId') update(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Body() body: CategoryUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateReference('categories', id, body, actorId(user));
  }
  @Delete(':entityId') remove(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.deactivateReference('categories', id, actorId(user));
  }
  @Post(':entityId/reactivate') reactivate(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateReference('categories', id, actorId(user));
  }
}

@ApiTags('salts')
@Controller({ path: 'salts', version: '1' })
export class SaltsController {
  constructor(private readonly service: ReferencesService) {}
  @Get() list(@Query() query: ReferenceListQueryDto) {
    return this.service.listReferences('salts', query);
  }
  @Post() @HttpCode(HttpStatus.CREATED) create(
    @Body() body: SaltCreateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.createReference('salts', body, actorId(user));
  }
  @Get(':entityId') get(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getReference('salts', id, deleted === 'true');
  }
  @Patch(':entityId') update(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Body() body: SaltUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateReference('salts', id, body, actorId(user));
  }
  @Delete(':entityId') remove(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.deactivateReference('salts', id, actorId(user));
  }
  @Post(':entityId/reactivate') reactivate(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateReference('salts', id, actorId(user));
  }
}

@ApiTags('dosage-forms')
@Controller({ path: 'dosage-forms', version: '1' })
export class DosageFormsController {
  constructor(private readonly service: ReferencesService) {}
  @Get() list(@Query() query: ReferenceListQueryDto) {
    return this.service.listReferences('dosage-forms', query);
  }
  @Post() @HttpCode(HttpStatus.CREATED) create(
    @Body() body: DosageFormCreateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.createReference('dosage-forms', body, actorId(user));
  }
  @Get(':entityId') get(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getReference('dosage-forms', id, deleted === 'true');
  }
  @Patch(':entityId') update(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Body() body: DosageFormUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateReference('dosage-forms', id, body, actorId(user));
  }
  @Delete(':entityId') remove(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.deactivateReference('dosage-forms', id, actorId(user));
  }
  @Post(':entityId/reactivate') reactivate(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateReference('dosage-forms', id, actorId(user));
  }
}

@ApiTags('units')
@Controller({ path: 'units', version: '1' })
export class UnitsController {
  constructor(private readonly service: ReferencesService) {}
  @Get() list(@Query() query: ReferenceListQueryDto) {
    return this.service.listReferences('units', query);
  }
  @Post() @HttpCode(HttpStatus.CREATED) create(
    @Body() body: UnitCreateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.createReference('units', body, actorId(user));
  }
  @Get(':entityId') get(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getReference('units', id, deleted === 'true');
  }
  @Patch(':entityId') update(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Body() body: UnitUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateReference('units', id, body, actorId(user));
  }
  @Delete(':entityId') remove(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.deactivateReference('units', id, actorId(user));
  }
  @Post(':entityId/reactivate') reactivate(
    @Param('entityId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateReference('units', id, actorId(user));
  }
}

@ApiTags('substitution-groups')
@Controller({ path: 'substitution-groups', version: '1' })
export class SubstitutionGroupsController {
  constructor(private readonly service: ReferencesService) {}

  @Get()
  list(@Query() query: SubstitutionGroupListQueryDto) {
    return this.service.listSubstitutionGroups(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: SubstitutionGroupCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createSubstitutionGroup(body, actorId(user));
  }

  @Get(':groupId/products')
  products(@Param('groupId', new ParseUUIDPipe()) groupId: string) {
    return this.service.listSubstitutionGroupProducts(groupId);
  }

  @Post(':groupId/products')
  @HttpCode(HttpStatus.CREATED)
  addProduct(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Body() body: SubstitutionGroupProductCreateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.addSubstitutionGroupProduct(groupId, body, actorId(user));
  }

  @Patch(':groupId/products/:productId')
  updateProduct(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() body: SubstitutionGroupProductUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateSubstitutionGroupProduct(groupId, productId, body, actorId(user));
  }

  @Delete(':groupId/products/:productId')
  removeProduct(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.service.removeSubstitutionGroupProduct(groupId, productId);
  }

  @Get(':groupId')
  get(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getSubstitutionGroup(groupId, deleted === 'true');
  }

  @Patch(':groupId')
  update(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Body() body: SubstitutionGroupUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateSubstitutionGroup(groupId, body, actorId(user));
  }

  @Delete(':groupId')
  remove(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.deactivateSubstitutionGroup(groupId, actorId(user));
  }

  @Post(':groupId/reactivate')
  reactivate(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateSubstitutionGroup(groupId, actorId(user));
  }
}
