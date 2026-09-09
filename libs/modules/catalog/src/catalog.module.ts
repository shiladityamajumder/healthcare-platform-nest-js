import { Module } from '@nestjs/common';
import { CreateProductModule } from './features/create-product/create-product.module';
import { GetProductModule } from './features/get-product/get-product.module';
import { ListProductsModule } from './features/list-products/list-products.module';
import { UpdateProductModule } from './features/update-product/update-product.module';
import { CategoriesModule } from './features/categories/categories.module';
import { BrandsModule } from './features/brands/brands.module';

/** Composition root for the Catalog bounded context. */
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
