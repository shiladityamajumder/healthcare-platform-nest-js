// * Linked with: @nestjs/common, rxjs, ./api-response.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponseFactory } from './api-response';

// * Define the shared types or behavior used by the surrounding package.
@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, unknown> {
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

function isPaginatedResult(
  value: unknown,
): value is { data: unknown; pagination: import('./api-response').PaginationMeta } {
  return typeof value === 'object' && value !== null && 'data' in value && 'pagination' in value;
}
