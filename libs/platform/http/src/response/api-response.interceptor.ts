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
    return next.handle().pipe(map((data) => ApiResponseFactory.success(data)));
  }
}
