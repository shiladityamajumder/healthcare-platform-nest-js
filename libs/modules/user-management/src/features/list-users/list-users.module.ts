// Linked with: @nestjs/common, ./api/http/v1/list-users.controller, ./application/list-users.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ListUsersController } from './api/http/v1/list-users.controller';
import { ListUsersHandler } from './application/list-users.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ListUsersController],
  providers: [ListUsersHandler],
})
export class ListUsersModule {}
