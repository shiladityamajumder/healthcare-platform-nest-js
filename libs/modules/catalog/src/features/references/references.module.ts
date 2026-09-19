import { Module } from '@nestjs/common';
import { CatalogInfrastructureModule } from '../../infrastructure/catalog-infrastructure.module';
import {
  BrandsController,
  CategoriesController,
  DosageFormsController,
  ManufacturersController,
  SaltsController,
  UnitsController,
} from './references.controller';
import { ReferencesService } from './references.service';

@Module({
  imports: [CatalogInfrastructureModule],
  controllers: [
    BrandsController,
    ManufacturersController,
    CategoriesController,
    SaltsController,
    DosageFormsController,
    UnitsController,
  ],
  providers: [ReferencesService],
})
export class ReferencesModule {}
