// * Provides HTTP request context, response formatting, and exception handling for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponseFactory } from './api-response';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  // * Converts controller return values into the standard successful API envelope.
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (isPaginatedResult(data))
          return ApiResponseFactory.success(data.data, undefined, data.pagination);
        return ApiResponseFactory.success(data);
      }),
    );
  }
}

// * Detects the pagination shape so its data can be placed in the response envelope correctly.
function isPaginatedResult(
  value: unknown,
): value is { data: unknown; pagination: import('./api-response').PaginationMeta } {
  return typeof value === 'object' && value !== null && 'data' in value && 'pagination' in value;
}
