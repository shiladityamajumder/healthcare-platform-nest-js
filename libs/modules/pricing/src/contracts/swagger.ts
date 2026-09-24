// * Pricing module: Defines reusable OpenAPI decorators for pricing endpoints.
// * File: src/contracts/swagger.ts
// ? Keep documentation aligned with the shared response envelope and pricing transport contracts.
// ! These decorators describe the API only; they must not change validation, authorization, or persistence behavior.
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

type PricingErrorDocumentation = {
  notFound?: string;
  conflict?: string;
  unavailable?: string;
  internal?: string;
};

function errorSchema(code: string, message: string) {
  return { example: { ...errorExample, message, error: { code, details: null } } };
}

/** Add the operation explanation and the standard request-correlation headers. */
export function ApiPricingOperation(summary: string, description: string): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary,
      description: [
        '### Why use this endpoint?',
        description,
        '### Request',
        'Provide the path parameters, query parameters, and/or JSON body shown below. Fields marked **required** must be supplied. Use the examples and field descriptions as the frontend integration contract.',
        '### Successful result',
        'Successful responses use the platform envelope with `success: true`; the operation result is in `data`, while request identifiers and the handled API version are in `meta` and the response headers.',
        '### Authentication and audit context',
        'Pricing routes currently do not consume a bearer token directly. Write operations accept the optional `X-User-ID` header as an audit actor when the caller already has a validated user identity; this header is not a substitute for application authorization.',
        '### Error handling',
        'Validation failures return HTTP 400. Missing resources return HTTP 404, state or duplicate conflicts return HTTP 409, dependency failures return HTTP 503, and unexpected failures return HTTP 500 when applicable. Frontends should branch on `error.code` and retain `meta.requestId` for support.',
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
      description: 'Optional identifier for correlating this request with related client operations.',
      schema: { type: 'string', example: 'pricing-screen-load-01' },
    }),
  );
}

/** Document the optional audit actor accepted by pricing write endpoints. */
export function ApiPricingAuditHeader(): MethodDecorator {
  return ApiHeader({
    name: 'X-User-ID',
    required: false,
    description:
      'Optional UUID of the authenticated actor. It is recorded in audit columns when valid; it does not grant access by itself.',
    schema: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
  });
}

/** Document a request DTO while keeping the controller method type as the source of truth. */
export function ApiPricingBody(type: Type<unknown>, description: string): MethodDecorator {
  return ApiBody({
    type,
    required: true,
    description: `${description} Required fields, accepted values, and validation constraints are shown in the schema below.`,
  });
}

/** Document a validated query DTO. */
export function ApiPricingQuery(type: Type<unknown>, description: string): MethodDecorator {
  return ApiQuery({ type, description });
}

/** Document the soft-deleted resource visibility query used by detail endpoints. */
export function ApiPricingIncludeDeletedQuery(): MethodDecorator {
  return ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'When true, include a soft-deleted record in the lookup. Defaults to false.',
    example: false,
  });
}

/** Document a UUID path parameter validated by ParseUUIDPipe. */
export function ApiPricingUuidParam(name: string, description: string): MethodDecorator {
  return ApiParam({
    name,
    required: true,
    description,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  });
}

/** Add the validation response emitted by the global ValidationPipe. */
export function ApiPricingValidationError(): MethodDecorator {
  return ApiBadRequestResponse({
    description:
      'The request body, query, or path parameter failed validation. Common causes include a malformed UUID, invalid date window, unsupported status, invalid numeric amount, or missing optimistic-lock rowVersion.',
    schema: errorSchema('VALIDATION_ERROR', 'The request contains invalid or incomplete pricing data.'),
  });
}

/** Document errors that can be returned by pricing application workflows. */
export function ApiPricingErrors(options: PricingErrorDocumentation): MethodDecorator & ClassDecorator {
  const decorators: MethodDecorator[] = [];

  if (options.notFound) {
    decorators.push(
      ApiNotFoundResponse({
        description: options.notFound,
        schema: errorSchema('RESOURCE_NOT_FOUND', options.notFound),
      }),
    );
  }
  if (options.conflict) {
    decorators.push(
      ApiConflictResponse({
        description: options.conflict,
        schema: errorSchema('RESOURCE_CONFLICT', options.conflict),
      }),
    );
  }
  if (options.unavailable) {
    decorators.push(
      ApiServiceUnavailableResponse({
        description: options.unavailable,
        schema: errorSchema('DATABASE_ERROR', options.unavailable),
      }),
    );
  }
  if (options.internal) {
    decorators.push(
      ApiInternalServerErrorResponse({
        description: options.internal,
        schema: errorSchema('INTERNAL_SERVER_ERROR', options.internal),
      }),
    );
  }

  return applyDecorators(...decorators);
}

/** Add the standard successful response envelope used by the HTTP response interceptor. */
export function ApiPricingResponse(
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

/** Add the standard successful response envelope for paginated list endpoints. */
export function ApiPricingPaginatedResponse(description: string, dataExample: unknown): MethodDecorator {
  return ApiResponse({
    status: 200,
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
          pagination: { totalCount: 1, limit: 20, offset: 0, hasNext: false },
        },
      },
    },
    headers: responseHeaders,
  });
}
