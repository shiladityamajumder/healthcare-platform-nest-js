// * Provides HTTP request context, response formatting, and exception handling for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { getApiVersion, getCorrelationId, getRequestId } from '../context/request-context';

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
  error: null;
  meta: ResponseMeta;
}

export interface ResponseMeta {
  requestId?: string;
  correlationId?: string;
  apiVersion: string;
  timestamp: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  totalCount: number;
  limit: number;
  offset: number;
  hasNext: boolean;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  data: null;
  error: {
    code: string;
    details: unknown;
  };
  meta: ResponseMeta;
}

export class ApiResponseFactory {
  // * Builds the standard successful response envelope, including optional pagination metadata.
  public static success<T>(
    data: T,
    message = 'Operation completed successfully.',
    pagination?: PaginationMeta,
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      error: null,
      meta: buildMeta(pagination),
    };
  }

  // * Builds the standard failed response envelope with a stable error code and details payload.
  public static error(code: string, message: string, details: unknown = null): ApiErrorResponse {
    return {
      success: false,
      message,
      data: null,
      error: { code, details },
      meta: buildMeta(),
    };
  }
}

// * Collects request metadata and timestamps for a consistent API response envelope.
function buildMeta(pagination?: PaginationMeta): ResponseMeta {
  return {
    requestId: getRequestId(),
    correlationId: getCorrelationId(),
    apiVersion: getApiVersion(),
    timestamp: new Date().toISOString(),
    ...(pagination ? { pagination } : {}),
  };
}
