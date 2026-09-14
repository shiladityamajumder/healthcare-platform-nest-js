// * Provides HTTP request context, response formatting, and exception handling for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExecutionModule, OperationExecutionInterceptor } from '@platform/execution';
import { LoggingModule } from '@platform/logging';
import { ApiExceptionFilter } from './errors/api-exception.filter';
import { ApiResponseInterceptor } from './response/api-response.interceptor';
import { RequestContextMiddleware } from './context/request-context.middleware';

@Module({
  imports: [ExecutionModule, LoggingModule],
  providers: [
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: OperationExecutionInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
  ],
})
export class HttpKernelModule implements NestModule {
  // * Applies request-context middleware to every HTTP route in the application.
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestContextMiddleware)
      .forRoutes({ path: '{*path}', method: RequestMethod.ALL });
  }
}
