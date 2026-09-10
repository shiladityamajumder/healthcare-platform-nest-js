// Linked with: @nestjs/common, ./api/http/v1/get-user.controller, ./application/get-user.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetUserController } from './api/http/v1/get-user.controller';
import { GetUserHandler } from './application/get-user.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetUserController],
  providers: [GetUserHandler],
})
export class GetUserModule {}
