// * Provides operation execution, logging, timeout, and transaction boundaries for the application.
// * Used by modules and application bootstrap code through the platform public API.
import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '@platform/database';
import { LoggingModule } from '@platform/logging';
import { ExecutionService } from './execution.service';

@Global()
@Module({
  imports: [DatabaseModule, LoggingModule],
  providers: [ExecutionService],
  exports: [ExecutionService],
})
export class ExecutionModule {}
