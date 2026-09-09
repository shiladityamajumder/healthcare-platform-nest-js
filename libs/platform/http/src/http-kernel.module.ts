import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingModule } from '@platform/logging';
import { ApiExceptionFilter } from './errors/api-exception.filter';
import { ApiResponseInterceptor } from './response/api-response.interceptor';
import { RequestContextMiddleware } from './context/request-context.middleware';

@Module({
  imports: [LoggingModule],
  providers: [
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
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
