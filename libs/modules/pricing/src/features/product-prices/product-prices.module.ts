// * Pricing module: Registers the product-prices feature.
// * File: src/features/product-prices/product-prices.module.ts
// ? Keep this feature boundary focused on product-price transport and application behavior.
import { Module } from '@nestjs/common';
import { PricingInfrastructureModule } from '../../infrastructure/pricing-infrastructure.module';
import { ProductPricesController } from './product-prices.controller';
import { ProductPricesService } from './product-prices.service';

@Module({
  imports: [PricingInfrastructureModule],
  controllers: [ProductPricesController],
  providers: [ProductPricesService],
})
export class ProductPricesModule {}
