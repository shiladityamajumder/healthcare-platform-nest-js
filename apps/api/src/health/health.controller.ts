import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

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
