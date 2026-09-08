import { Module } from '@nestjs/common';
import { ChangePasswordController } from './api/http/v1/change-password.controller';
import { ChangePasswordHandler } from './application/change-password.handler';

@Module({
  controllers: [ChangePasswordController],
  providers: [ChangePasswordHandler],
})
export class ChangePasswordModule {}
