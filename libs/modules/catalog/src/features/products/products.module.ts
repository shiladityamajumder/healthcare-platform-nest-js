import { Module } from '@nestjs/common';
import { CatalogInfrastructureModule } from '../../infrastructure/catalog-infrastructure.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [CatalogInfrastructureModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
