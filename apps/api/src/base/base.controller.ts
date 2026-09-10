// Linked with: @nestjs/common, @platform/execution.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { NonTransactional } from '@platform/execution';

// Define the shared types or behavior used by the surrounding package.
@NonTransactional()
@Controller({ path: '', version: VERSION_NEUTRAL })
export class BaseController {
  @Get()
  public getApiMetadata() {
    const publicBaseUrl = (
      process.env.PUBLIC_BASE_URL ?? `http://localhost:${process.env.PORT ?? '3000'}`
    ).replace(/\/$/, '');
    const apiPrefix = process.env.API_PREFIX ?? 'api';
    const baseUrl = `${publicBaseUrl}/${apiPrefix}`;

    return {
      name: 'Healthcare Platform API',
      status: 'ok',
      apiVersion: `v${process.env.API_VERSION ?? '1'}`,
      baseUrl,
      docsUrl: `${baseUrl}/docs`,
      healthUrl: `${baseUrl}/health/live`,
    };
  }
}
