// * Inventory module: Defines reusable OpenAPI decorators for stock and warehouse endpoints.
// * File: src/contracts/swagger.ts
// ? Keep Swagger descriptions aligned with the platform response envelope and inventory workflows.
// ! These decorators document the API only; they do not change validation, authorization, or SQL behavior.
import { applyDecorators, type Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';

const errorExample = {
  success: false,
  message: 'The request could not be completed.',
  data: null,
  error: { code: 'HTTP_ERROR', details: null },
  meta: {
    requestId: 'request-id',
    correlationId: 'correlation-id',
    apiVersion: 'v1',
    timestamp: '2026-01-01T00:00:00.000Z',
  },
};

const responseHeaders = {
  'X-Request-ID': {
    description: 'Identifier assigned to this request for support and log correlation.',
    schema: { type: 'string', example: 'request-id' },
  },
  'X-Correlation-ID': {
    description: 'Identifier used to correlate this request with related client operations.',
    schema: { type: 'string', example: 'inventory-screen-load-01' },
  },
  'X-API-Version': {
    description: 'API version that handled the request.',
    schema: { type: 'string', example: 'v1' },
  },
};

function errorSchema(code: string, message: string) {
  return { example: { ...errorExample, message, error: { code, details: null } } };
}

/** Explain the business purpose, request contract, response envelope, and failure handling. */
export function ApiInventoryOperation(summary: string, description: string): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary,
      description: [
        '### Why use this endpoint?',
        description,
        '### Request and authorization',
        'Send the path parameters, query parameters, and JSON body shown below. Read operations do not require an access token in the current inventory controller. Write operations accept `X-User-ID` for audit attribution; stock adjustments, reservations, transfers, and cycle-count completion validate that the supplied actor is a UUID. The header is an actor context, not an authentication substitute.',
        '### Successful response',
        'Responses use the platform envelope: `success: true`, the operation result in `data`, and request/version metadata in `meta` and response headers. Paginated endpoints return `data.items` with `pagination.totalCount`, `limit`, `offset`, and `hasNext`.',
        '### Inventory safety',
        'Stock-changing operations run transactionally, reject insufficient available stock, preserve stock-ledger history, and use idempotency or row locking where the workflow requires it. Never calculate final stock only in the frontend.',
        '### Error handling',
        'Use `error.code` as the stable client key and retain `meta.requestId` for support. Validation failures return HTTP 400, missing resources return HTTP 404, duplicate or invalid state/stock conflicts return HTTP 409, dependency failures return HTTP 503, and unexpected failures return HTTP 500 when applicable.',
      ].join('\n\n'),
    }),
    ApiHeader({
      name: 'X-Request-ID',
      required: false,
      description: 'Optional client-generated request identifier. The API generates one when omitted.',
      schema: { type: 'string', example: 'request-id' },
    }),
    ApiHeader({
      name: 'X-Correlation-ID',
      required: false,
      description: 'Optional identifier for correlating this request with related operations.',
      schema: { type: 'string', example: 'inventory-screen-load-01' },
    }),
  );
}

/** Document the actor context used by inventory audit columns and protected stock changes. */
export function ApiInventoryActorHeader(): MethodDecorator {
  return ApiHeader({
    name: 'X-User-ID',
    required: false,
    description:
      'UUID of the acting user. It is recorded in audit fields where supported. For stock adjustments, transfer workflows, and cycle-count completion, a valid UUID is required by the application service. This header does not grant permissions by itself.',
    schema: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
  });
}

/** Connect a validated inventory DTO to the OpenAPI request-body schema. */
export function ApiInventoryBody(type: Type<unknown>, description: string): MethodDecorator {
  return ApiBody({
    type,
    required: true,
    description: `${description} Required fields, accepted values, and validation constraints are shown in the schema below.`,
  });
}

/** Connect a validated inventory query DTO to OpenAPI metadata. */
export function ApiInventoryQuery(type: Type<unknown>, description: string): MethodDecorator {
  return ApiQuery({ type, description });
}

/** Document a UUID path parameter validated by ParseUUIDPipe. */
export function ApiInventoryUuidParam(name: string, description: string): MethodDecorator {
  return ApiParam({
    name,
    required: true,
    description,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  });
}

/** Document a primitive query parameter that is not represented by a DTO class. */
export function ApiInventoryQueryParam(
  name: string,
  description: string,
  options: Record<string, unknown> = {},
): MethodDecorator {
  return ApiQuery({ name, description, ...options });
}

/** Add the standard successful response envelope used by ApiResponseInterceptor. */
export function ApiInventoryResponse(
  description: string,
  dataExample: unknown,
  status = 200,
): MethodDecorator {
  return ApiResponse({
    status,
    description,
    schema: {
      example: {
        success: true,
        message: 'Operation completed successfully.',
        data: dataExample,
        error: null,
        meta: {
          requestId: 'request-id',
          correlationId: 'inventory-screen-load-01',
          apiVersion: 'v1',
          timestamp: '2026-01-01T00:00:00.000Z',
        },
      },
    },
    headers: responseHeaders,
  });
}

/** Add the paginated success envelope used by inventory listing endpoints. */
export function ApiInventoryPaginatedResponse(description: string, itemsExample: unknown): MethodDecorator {
  return ApiInventoryResponse(
    description,
    {
      items: itemsExample,
    },
  );
}

/** Document the standard inventory validation, missing-resource, conflict, and infrastructure errors. */
export function ApiInventoryErrors(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiBadRequestResponse({
      description:
        'The request body, query, or path parameter failed validation. Common causes include malformed UUIDs, invalid numeric quantities, expired dates, missing rowVersion, or missing required cycle-count/transfer fields.',
      schema: errorSchema('VALIDATION_ERROR', 'The request contains invalid inventory data.'),
    }),
    ApiNotFoundResponse({
      description:
        'The requested warehouse, bin, lot, reservation, hold, transfer, adjustment, or cycle count was not found.',
      schema: errorSchema('RESOURCE_NOT_FOUND', 'The requested inventory resource was not found.'),
    }),
    ApiConflictResponse({
      description:
        'The operation conflicts with current stock, lifecycle state, idempotency key, transfer/reservation state, or optimistic rowVersion.',
      schema: errorSchema('RESOURCE_CONFLICT', 'The inventory operation conflicts with current state.'),
    }),
    ApiInternalServerErrorResponse({
      description: 'An unexpected inventory application or infrastructure failure occurred.',
      schema: errorSchema('INTERNAL_SERVER_ERROR', 'The inventory operation could not be completed.'),
    }),
    ApiServiceUnavailableResponse({
      description: 'The externally managed inventory database or another required dependency is temporarily unavailable.',
      schema: errorSchema('DATABASE_ERROR', 'A required inventory dependency is unavailable.'),
    }),
  );
}
