// * Catalog module: Defines validated DTOs for product endpoints.
// * File: src/features/products/products.schema.ts
// ? Keep transport contracts close to the products feature like the auth schemas.
export {
  BulkProductStatusDto,
  CreateProductDto,
  ProductListQueryDto,
  ProductRelationshipCreateDto,
  ProductRelationshipUpdateDto,
  ProductSearchQueryDto,
  ReplaceProductDetailsDto,
  UpdateProductDto,
} from '../../contracts/catalog.schema';
