// * Linked with: @nestjs/common, @platform/execution.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NonTransactional } from '@platform/execution';

// * Define the shared types or behavior used by the surrounding package.
@NonTransactional()
@ApiTags('system')
@Controller({ path: '', version: VERSION_NEUTRAL })
export class BaseController {
  @Get()
  @ApiOperation({
    summary: 'Get API metadata',
    description: [
      '### Why use this endpoint?',
      'Use this endpoint when a frontend or client needs to discover the running service, active API version, and available documentation or health URLs.',
      '### Request',
      'No request body, query parameters, or authentication are required.',
      '### What the API does',
      'Returns service metadata generated from the current runtime configuration.',
      '### Successful result',
      'The `data` object contains the service name, status, base URL, documentation URL, and liveness URL.',
    ].join('\n\n'),
  })
  @ApiOkResponse({
    description: 'API metadata returned successfully.',
    schema: {
      example: {
        success: true,
        message: 'Operation completed successfully.',
        data: {
          name: 'Healthcare Platform API',
          status: 'ok',
          apiVersion: 'v1',
          baseUrl: 'http://localhost:3000/api',
          docsUrl: 'http://localhost:3000/api/docs',
          healthUrl: 'http://localhost:3000/api/health/live',
        },
        error: null,
        meta: {
          requestId: 'request-id',
          correlationId: 'correlation-id',
          apiVersion: 'v1',
          timestamp: '2026-01-01T00:00:00.000Z',
        },
      },
    },
  })
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
