import { Module } from '@nestjs/common';
import { RegistrationController } from './api/http/v1/registration.controller';
import { RegistrationHandler } from './application/registration.handler';

@Module({
  controllers: [RegistrationController],
  providers: [RegistrationHandler],
})
export class RegistrationModule {}
