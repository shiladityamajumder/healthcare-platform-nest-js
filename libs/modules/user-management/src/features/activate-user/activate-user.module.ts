// * Linked with: @nestjs/common, ./activate-user.controller, ./activate-user.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ActivateUserController } from './activate-user.controller';
import { ActivateUserHandler } from './activate-user.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ActivateUserController],
  providers: [ActivateUserHandler],
})
export class ActivateUserModule {}
