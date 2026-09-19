// * Catalog module: Implements reference-master use cases for the references feature.
// * File: src/features/references/references.service.ts
// ? Keep reference orchestration behind the feature service boundary.
// ! Do not move SQL or transport concerns into this service.
import { Inject, Injectable } from '@nestjs/common';
import { CatalogService } from '../../application/catalog.service';
import { CATALOG_REPOSITORY, type CatalogRepositoryPort } from '../../contracts/catalog.ports';

/** Reference-facing service boundary backed by the catalog application workflow. */
@Injectable()
export class ReferencesService extends CatalogService {
  public constructor(@Inject(CATALOG_REPOSITORY) repository: CatalogRepositoryPort) {
    super(repository);
  }
}
