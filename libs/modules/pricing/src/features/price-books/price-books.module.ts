// * Pricing module: Registers the price-books feature.
// * File: src/features/price-books/price-books.module.ts
// ? Keep this feature boundary focused on price-book transport and application behavior.
import { Module } from '@nestjs/common';
import { PricingInfrastructureModule } from '../../infrastructure/pricing-infrastructure.module';
import { PriceBooksController } from './price-books.controller';
import { PriceBooksService } from './price-books.service';

@Module({
  imports: [PricingInfrastructureModule],
  controllers: [PriceBooksController],
  providers: [PriceBooksService],
})
export class PriceBooksModule {}
