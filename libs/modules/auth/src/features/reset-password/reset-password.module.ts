import { Module } from '@nestjs/common';
import { ResetPasswordController } from './api/http/v1/reset-password.controller';
import { ResetPasswordHandler } from './application/reset-password.handler';

@Module({
  controllers: [ResetPasswordController],
  providers: [ResetPasswordHandler],
})
export class ResetPasswordModule {}
