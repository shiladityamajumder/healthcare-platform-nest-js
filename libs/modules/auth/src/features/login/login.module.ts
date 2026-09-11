// * Linked with: @nestjs/common, ./api/http/v1/login.controller, ./application/login.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { LoginController } from './api/http/v1/login.controller';
import { LoginHandler } from './application/login.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [LoginController],
  providers: [LoginHandler],
})
export class LoginModule {}
