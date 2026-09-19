// * Catalog module: Implements product use cases for the products feature.
// * File: src/features/products/products.service.ts
// ? Keep product orchestration behind the feature service boundary.
// ! Do not move SQL or transport concerns into this service.
import { Inject, Injectable } from '@nestjs/common';
import { CatalogService } from '../../application/catalog.service';
import { CATALOG_REPOSITORY, type CatalogRepositoryPort } from '../../contracts/catalog.ports';

/** Product-facing service boundary backed by the catalog application workflow. */
@Injectable()
export class ProductsService extends CatalogService {
  public constructor(@Inject(CATALOG_REPOSITORY) repository: CatalogRepositoryPort) {
    super(repository);
  }
}
