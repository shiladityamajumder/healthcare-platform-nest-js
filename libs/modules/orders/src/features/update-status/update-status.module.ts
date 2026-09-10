// Linked with: @nestjs/common, ./api/http/v1/update-status.controller, ./application/update-status.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { UpdateStatusController } from './api/http/v1/update-status.controller';
import { UpdateStatusHandler } from './application/update-status.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [UpdateStatusController],
  providers: [UpdateStatusHandler],
})
export class UpdateStatusModule {}
