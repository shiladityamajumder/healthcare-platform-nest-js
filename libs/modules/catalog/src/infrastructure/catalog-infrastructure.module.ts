// * Catalog module: Wires database adapters and application collaborators.
// * File: src/infrastructure/catalog-infrastructure.module.ts
// ? Keep SQL and provider details private to the catalog bounded context.
// ! Do not expose catalog persistence outside the feature modules.
/**
 * Registers catalog persistence used by the feature services.
 * Used backward by catalog feature modules; connects forward to the platform database.
 */
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@platform/database';
import { CATALOG_REPOSITORY } from '../contracts/catalog.ports';
import { CatalogRepository } from './persistence/catalog.repository';

@Module({
  imports: [DatabaseModule],
  providers: [CatalogRepository, { provide: CATALOG_REPOSITORY, useExisting: CatalogRepository }],
  exports: [CatalogRepository, CATALOG_REPOSITORY],
})
export class CatalogInfrastructureModule {}
