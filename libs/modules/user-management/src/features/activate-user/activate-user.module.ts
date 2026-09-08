import { Module } from '@nestjs/common';
import { ActivateUserController } from './api/http/v1/activate-user.controller';
import { ActivateUserHandler } from './application/activate-user.handler';

@Module({
  controllers: [ActivateUserController],
  providers: [ActivateUserHandler],
})
export class ActivateUserModule {}
