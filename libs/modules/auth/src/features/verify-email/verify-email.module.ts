import { Module } from '@nestjs/common';
import { VerifyEmailController } from './api/http/v1/verify-email.controller';
import { VerifyEmailHandler } from './application/verify-email.handler';

@Module({
  controllers: [VerifyEmailController],
  providers: [VerifyEmailHandler],
})
export class VerifyEmailModule {}
