// * Catalog module: Composes reference-master and substitution-group components.
// * File: src/features/references/references.module.ts
// ? Keep reference transport and application wiring inside the catalog feature boundary.
import { Module } from '@nestjs/common';
import { CatalogInfrastructureModule } from '../../infrastructure/catalog-infrastructure.module';
import {
  BrandsController,
  CategoriesController,
  DosageFormsController,
  ManufacturersController,
  SaltsController,
  SubstitutionGroupsController,
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
    SubstitutionGroupsController,
  ],
  providers: [ReferencesService],
})
/** NestJS module boundary for catalog reference endpoints. */
export class ReferencesModule {}
