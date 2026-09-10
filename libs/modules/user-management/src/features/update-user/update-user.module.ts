// Linked with: @nestjs/common, ./api/http/v1/update-user.controller, ./application/update-user.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { UpdateUserController } from './api/http/v1/update-user.controller';
import { UpdateUserHandler } from './application/update-user.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [UpdateUserController],
  providers: [UpdateUserHandler],
})
export class UpdateUserModule {}
