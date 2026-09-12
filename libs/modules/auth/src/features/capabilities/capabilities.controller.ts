/**
 * Public capability and JWKS discovery routes.
 * Used backward by external clients through Nest routing; connects forward to CapabilitiesService.
 * These read-only discovery endpoints are explicitly non-transactional.
 */
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NonTransactional } from '@platform/execution';
import { CapabilitiesService } from './capabilities.service';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class CapabilitiesController {
  public constructor(private readonly service: CapabilitiesService) {}

  @Get('capabilities')
  @NonTransactional()
  capabilities() {
    return this.service.capabilities();
  }

  @Get('.well-known/jwks.json')
  @NonTransactional()
  jwks() {
    return this.service.jwks();
  }
}
