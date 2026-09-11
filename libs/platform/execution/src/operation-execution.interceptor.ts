// * Linked with: @nestjs/common, @nestjs/core, rxjs.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { from, lastValueFrom, type Observable } from 'rxjs';
import { ExecutionService } from './execution.service';
import { NON_TRANSACTIONAL_METADATA } from './non-transactional.decorator';

/** Wrap every HTTP handler in one logged operation and DB transaction. */
// * Define the shared types or behavior used by the surrounding package.
@Injectable()
export class OperationExecutionInterceptor implements NestInterceptor {
  public constructor(
    private readonly execution: ExecutionService,
    private readonly reflector: Reflector,
  ) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();

    const controller = context.getClass()?.name ?? 'UnknownController';
    const handler = context.getHandler()?.name ?? 'unknownHandler';
    const nonTransactional = this.reflector.getAllAndOverride<boolean>(NON_TRANSACTIONAL_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    return from(
      this.execution.execute(
        {
          operation: `${controller}.${handler}`,
          layer: 'http',
          transactional: !nonTransactional,
        },
        () => lastValueFrom(next.handle()),
      ),
    );
  }
}
