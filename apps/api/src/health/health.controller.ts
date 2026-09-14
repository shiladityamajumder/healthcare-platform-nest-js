// * Linked with: @nestjs/common, @platform/execution.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NonTransactional } from '@platform/execution';

// * Define the shared types or behavior used by the surrounding package.
@NonTransactional()
@ApiTags('system')
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  @Get('live')
  @ApiOperation({
    summary: 'Check liveness',
    description: [
      '### Why use this endpoint?',
      'Use this endpoint for load-balancer, container, and process liveness probes.',
      '### Request',
      'No request body, query parameters, or authentication are required.',
      '### What the API does',
      'Checks that the API process is running. This endpoint does not verify downstream dependencies.',
      '### Successful result',
      'Returns `data.status: ok` when the API process is available.',
    ].join('\n\n'),
  })
  @ApiOkResponse({
    description: 'The API process is running.',
    schema: {
      example: {
        success: true,
        message: 'Operation completed successfully.',
        data: { status: 'ok' },
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
  liveness() {
    return { status: 'ok' };
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Check readiness',
    description: [
      '### Why use this endpoint?',
      'Use this endpoint for deployment and traffic-routing readiness probes.',
      '### Request',
      'No request body, query parameters, or authentication are required.',
      '### What the API does',
      'Checks whether the API is ready to receive traffic.',
      '### Successful result',
      'Returns `data.status: ok` when the current readiness checks pass.',
    ].join('\n\n'),
  })
  @ApiOkResponse({
    description: 'The API is ready to receive traffic.',
    schema: {
      example: {
        success: true,
        message: 'Operation completed successfully.',
        data: { status: 'ok' },
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
  readiness() {
    return { status: 'ok' };
  }
}
