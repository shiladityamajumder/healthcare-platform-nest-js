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
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  public constructor(private readonly service: ProductsService) {}

  @Get()
  list(@Query() query: ProductListQueryDto) {
    return this.service.listProducts(query);
  }

  @Get('search')
  search(@Query() query: ProductSearchQueryDto) {
    return this.service.searchProducts(query);
  }

  @Get('by-code/:value')
  byCode(@Param('value') value: string) {
    return this.service.getProductByCode(value);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() input: CreateProductDto, @Headers('x-user-id') userId?: string) {
    return this.service.createProduct(input, actorId(userId));
  }

  @Patch('bulk-status')
  bulkStatus(@Body() input: BulkProductStatusDto, @Headers('x-user-id') userId?: string) {
    return this.service.bulkProductStatus(input, actorId(userId));
  }

  @Get(':productId/relationships')
  relationships(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Query('relationshipType') relationshipType?: string,
  ) {
    return this.service.listProductRelationships(productId, relationshipType);
  }

  @Get(':productId/relationships/:relationshipId')
  relationship(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Param('relationshipId', new ParseUUIDPipe()) relationshipId: string,
  ) {
    return this.service.getProductRelationship(productId, relationshipId);
  }

  @Post(':productId/relationships')
  @HttpCode(HttpStatus.CREATED)
  createRelationship(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() input: ProductRelationshipCreateDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.service.createProductRelationship(productId, input, actorId(userId));
  }

  @Patch(':productId/relationships/:relationshipId')
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

  @Delete(':productId/relationships/:relationshipId')
  deleteRelationship(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Param('relationshipId', new ParseUUIDPipe()) relationshipId: string,
  ) {
    return this.service.deleteProductRelationship(productId, relationshipId);
  }

  @Get(':productId/substitution-groups')
  substitutionGroups(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return this.service.listProductSubstitutionGroups(productId);
  }

  @Get(':productId')
  get(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    return this.service.getProduct(productId, includeDeleted === 'true');
  }

  @Patch(':productId')
  update(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() input: UpdateProductDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.service.updateProduct(productId, input, actorId(userId));
  }

  @Put(':productId/details')
  replaceDetails(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() input: ReplaceProductDetailsDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.service.replaceProductDetails(productId, input, actorId(userId));
  }

  @Delete(':productId')
  deactivate(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.service.deactivateProduct(productId, actorId(userId));
  }

  @Post(':productId/reactivate')
  reactivate(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.service.reactivateProduct(productId, actorId(userId));
  }
}
