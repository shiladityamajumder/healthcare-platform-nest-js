import { Inject, Injectable } from '@nestjs/common';
import { InventoryService } from '../../application/inventory.service';
import {
  INVENTORY_REPOSITORY,
  type InventoryRepositoryPort,
} from '../../contracts/inventory.ports';

/** Warehouse HTTP-facing handler backed by the shared inventory application service. */
@Injectable()
export class WarehousesHandler extends InventoryService {
  // * Function [constructor]: Connects warehouse routes to the shared inventory application service.
  public constructor(@Inject(INVENTORY_REPOSITORY) repository: InventoryRepositoryPort) {
    super(repository);
  }
}
