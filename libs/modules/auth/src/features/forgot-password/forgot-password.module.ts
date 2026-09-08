import { Module } from '@nestjs/common';
import { ForgotPasswordController } from './api/http/v1/forgot-password.controller';
import { ForgotPasswordHandler } from './application/forgot-password.handler';

@Module({
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordHandler],
})
export class ForgotPasswordModule {}
