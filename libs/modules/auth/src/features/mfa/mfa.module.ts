import { Module } from '@nestjs/common';
import { MfaController } from './api/http/v1/mfa.controller';
import { MfaHandler } from './application/mfa.handler';

@Module({
  controllers: [MfaController],
  providers: [MfaHandler],
})
export class MfaModule {}
