// * Linked with: @nestjs/common, @platform/execution.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { NonTransactional } from '@platform/execution';

// * Define the shared types or behavior used by the surrounding package.
@NonTransactional()
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  @Get('live')
  liveness() {
    return { status: 'ok' };
  }

  @Get('ready')
  readiness() {
    return { status: 'ok' };
  }
}
