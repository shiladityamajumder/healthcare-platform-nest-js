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
