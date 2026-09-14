// * Linked with: @nestjs/common, ./create-user.controller, ./create-user.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateUserController } from './create-user.controller';
import { CreateUserHandler } from './create-user.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CreateUserController],
  providers: [CreateUserHandler],
})
export class CreateUserModule {}
