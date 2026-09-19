// * Linked with: @nestjs/common, ./features/products/products.module, ./features/references/references.module.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ProductsModule } from './features/products/products.module';
import { ReferencesModule } from './features/references/references.module';

/** Composition root for the Catalog bounded context. */
// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [ProductsModule, ReferencesModule],
  exports: [],
})
export class CatalogModule {}
