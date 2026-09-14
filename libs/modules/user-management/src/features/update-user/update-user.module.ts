// * Linked with: @nestjs/common, ./update-user.controller, ./update-user.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { UpdateUserController } from './update-user.controller';
import { UpdateUserHandler } from './update-user.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [UpdateUserController],
  providers: [UpdateUserHandler],
})
export class UpdateUserModule {}
