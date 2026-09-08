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
  public static success<T>(data: T, message = 'Operation completed successfully.'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      error: null,
      meta: buildMeta(),
    };
  }

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

function buildMeta(): ResponseMeta {
  return {
    requestId: getRequestId(),
    correlationId: getCorrelationId(),
    apiVersion: getApiVersion(),
    timestamp: new Date().toISOString(),
  };
}
