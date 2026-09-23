// * Catalog module: Composes product transport and application components.
// * File: src/features/products/products.module.ts
// ? Keep product feature wiring separate from reference-master wiring.
import { Module } from '@nestjs/common';
import { CatalogInfrastructureModule } from '../../infrastructure/catalog-infrastructure.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [CatalogInfrastructureModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
/** NestJS module boundary for product endpoints. */
export class ProductsModule {}
