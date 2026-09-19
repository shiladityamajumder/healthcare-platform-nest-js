// * Pricing module: Defines validated DTOs for price-book endpoints.
// * File: src/features/price-books/price-books.schema.ts
// ? Keep transport contracts close to the price-books feature like the auth schemas.
export {
  PriceBookCreateDto,
  PriceBookListQueryDto,
  PriceBookUpdateDto,
} from '../../contracts/pricing.schema';
