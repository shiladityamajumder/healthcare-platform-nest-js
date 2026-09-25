import { Inject, Injectable } from '@nestjs/common';
import { InventoryService } from '../../application/inventory.service';
import {
  INVENTORY_REPOSITORY,
  type InventoryRepositoryPort,
} from '../../contracts/inventory.ports';

/** Inventory HTTP-facing handler backed by the shared inventory application service. */
@Injectable()
export class InventoryRoutesHandler extends InventoryService {
  // * Function [constructor]: Connects the mounted inventory routes to the shared application service.
  public constructor(@Inject(INVENTORY_REPOSITORY) repository: InventoryRepositoryPort) {
    super(repository);
  }
}
