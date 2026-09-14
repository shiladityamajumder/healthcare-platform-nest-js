// * Linked with: @nestjs/common, ./get-user.controller, ./get-user.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetUserController } from './get-user.controller';
import { GetUserHandler } from './get-user.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetUserController],
  providers: [GetUserHandler],
})
export class GetUserModule {}
