// * Linked with: @nestjs/common, ./features/create-product/create-product.module, ./features/get-product/get-product.module.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateProductModule } from './features/create-product/create-product.module';
import { GetProductModule } from './features/get-product/get-product.module';
import { ListProductsModule } from './features/list-products/list-products.module';
import { UpdateProductModule } from './features/update-product/update-product.module';
import { CategoriesModule } from './features/categories/categories.module';
import { BrandsModule } from './features/brands/brands.module';

/** Composition root for the Catalog bounded context. */
// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [
    CreateProductModule,
    GetProductModule,
    ListProductsModule,
    UpdateProductModule,
    CategoriesModule,
    BrandsModule,
  ],
  exports: [],
})
export class CatalogModule {}
