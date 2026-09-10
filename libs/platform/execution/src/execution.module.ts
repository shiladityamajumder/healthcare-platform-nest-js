// Linked with: @nestjs/common, @platform/database, @platform/logging.
// Used by: the application module or feature root during NestJS startup.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '@platform/database';
import { LoggingModule } from '@platform/logging';
import { ExecutionService } from './execution.service';

// Register the feature components and their dependencies with NestJS.
@Global()
@Module({
  imports: [DatabaseModule, LoggingModule],
  providers: [ExecutionService],
  exports: [ExecutionService],
})
export class ExecutionModule {}
