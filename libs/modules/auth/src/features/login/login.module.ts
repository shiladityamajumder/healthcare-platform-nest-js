import { Module } from '@nestjs/common';
import { LoginController } from './api/http/v1/login.controller';
import { LoginHandler } from './application/login.handler';

@Module({
  controllers: [LoginController],
  providers: [LoginHandler],
})
export class LoginModule {}
