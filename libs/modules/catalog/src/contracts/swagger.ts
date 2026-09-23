// * Catalog module: Defines reusable OpenAPI decorators for catalogue endpoints.
// * File: src/contracts/swagger.ts
// ? Keep documentation aligned with the existing catalog response and validation contracts.
// ! These decorators describe the API only; they must not change authorization or persistence behavior.
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
    schema: { type: 'string', example: 'correlation-id' },
  },
  'X-API-Version': {
    description: 'API version that handled the request.',
    schema: { type: 'string', example: 'v1' },
  },
};

function errorSchema(code: string, message: string) {
  return { example: { ...errorExample, message, error: { code, details: null } } };
}

/** Add the common request-correlation headers and an operation-level explanation. */
// * Decorator [ApiCatalogOperation]: Documents why, how, and when a catalog endpoint is used.
export function ApiCatalogOperation(summary: string, description: string): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary,
      description: [
        '### Why use this endpoint?',
        description,
        '### Request and authorization',
        'Send the path parameters, query parameters, and JSON body shown below. Read operations are available without a bearer token in the current catalog controller. Write operations accept the optional `X-User-ID` header for audit attribution; the current controller does not enforce that header as authentication.',
        '### Successful response',
        'Responses use the platform envelope: `success: true`, the operation result in `data`, and request/version metadata in `meta` and response headers.',
        '### Error handling',
        'Use `error.code` as the stable client key and retain `meta.requestId` for support. Validation is HTTP 400, missing records are HTTP 404, duplicate or invalid state is HTTP 409, dependency failures are HTTP 503, and unexpected failures are HTTP 500.',
      ].join('\n\n'),
    }),
    ApiHeader({
      name: 'X-Request-ID',
      required: false,
      description: 'Optional client-generated request identifier.',
      schema: { type: 'string', example: 'request-id' },
    }),
    ApiHeader({
      name: 'X-Correlation-ID',
      required: false,
      description: 'Optional identifier for correlating this request with related operations.',
      schema: { type: 'string', example: 'correlation-id' },
    }),
  );
}

/** Document an optional audit actor header used by catalog write operations. */
// * Decorator [ApiCatalogActorHeader]: Documents the optional audit actor context.
export function ApiCatalogActorHeader(): MethodDecorator {
  return ApiHeader({
    name: 'X-User-ID',
    required: false,
    description:
      'Optional UUID of the acting user used for createdBy, updatedBy, and deletedBy audit fields. This header is not an authentication substitute.',
    schema: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
  });
}

/** Document a validated JSON request body. */
// * Decorator [ApiCatalogBody]: Connects a catalog DTO to the OpenAPI request body schema.
export function ApiCatalogBody(type: Type<unknown>, description: string): MethodDecorator {
  return ApiBody({
    type,
    required: true,
    description: `${description} Required fields and validation constraints are shown in the schema below.`,
  });
}

/** Document a validated query DTO. */
// * Decorator [ApiCatalogQuery]: Connects a catalog query DTO to OpenAPI metadata.
export function ApiCatalogQuery(type: Type<unknown>, description: string): MethodDecorator {
  return ApiQuery({ type, description });
}

/** Document a simple query parameter not represented by a DTO class. */
// * Decorator [ApiCatalogQueryParam]: Documents a primitive catalog query parameter.
export function ApiCatalogQueryParam(
  name: string,
  description: string,
  options: Record<string, unknown> = {},
): MethodDecorator {
  return ApiQuery({ name, description, ...options });
}

/** Document a UUID path parameter validated by ParseUUIDPipe. */
// * Decorator [ApiCatalogUuidParam]: Documents a UUID route parameter and its expected format.
export function ApiCatalogUuidParam(name: string, description: string): MethodDecorator {
  return ApiParam({
    name,
    required: true,
    description,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  });
}

/** Document a string path parameter such as a product SKU or slug. */
// * Decorator [ApiCatalogStringParam]: Documents a string route parameter.
export function ApiCatalogStringParam(
  name: string,
  description: string,
  example: string,
): MethodDecorator {
  return ApiParam({ name, required: true, description, schema: { type: 'string', example } });
}

/** Add the standard successful response envelope used by the API response interceptor. */
// * Decorator [ApiCatalogResponse]: Documents the catalog success envelope and response headers.
export function ApiCatalogResponse(
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
          correlationId: 'correlation-id',
          apiVersion: 'v1',
          timestamp: '2026-01-01T00:00:00.000Z',
        },
      },
    },
    headers: responseHeaders,
  });
}

/** Add the common errors emitted by catalog validation, business rules, and persistence. */
// * Decorator [ApiCatalogErrors]: Documents common catalog failure responses.
export function ApiCatalogErrors(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'The request body, query, or path parameter failed validation.',
      schema: errorSchema('VALIDATION_ERROR', 'The request contains invalid catalog data.'),
    }),
    ApiNotFoundResponse({
      description:
        'The requested product, reference, relationship, or substitution group was not found.',
      schema: errorSchema('RESOURCE_NOT_FOUND', 'The requested catalog resource was not found.'),
    }),
    ApiConflictResponse({
      description:
        'The operation conflicts with an existing record, lifecycle state, or row version.',
      schema: errorSchema(
        'RESOURCE_CONFLICT',
        'The catalog operation conflicts with current state.',
      ),
    }),
    ApiInternalServerErrorResponse({
      description: 'An unexpected infrastructure or application failure occurred.',
      schema: errorSchema('INTERNAL_SERVER_ERROR', 'The catalog operation could not be completed.'),
    }),
    ApiServiceUnavailableResponse({
      description: 'The database or another required dependency is temporarily unavailable.',
      schema: errorSchema('DATABASE_ERROR', 'A required catalog dependency is unavailable.'),
    }),
  );
}
