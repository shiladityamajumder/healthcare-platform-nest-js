import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { NonTransactional } from '@platform/execution';

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
