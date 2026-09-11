// * Linked with: @nestjs/common, @nestjs/core, @platform/execution.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExecutionModule, OperationExecutionInterceptor } from '@platform/execution';
import { LoggingModule } from '@platform/logging';
import { ApiExceptionFilter } from './errors/api-exception.filter';
import { ApiResponseInterceptor } from './response/api-response.interceptor';
import { RequestContextMiddleware } from './context/request-context.middleware';

// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [ExecutionModule, LoggingModule],
  providers: [
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: OperationExecutionInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
  ],
})
export class HttpKernelModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestContextMiddleware)
      .forRoutes({ path: '{*path}', method: RequestMethod.ALL });
  }
}
