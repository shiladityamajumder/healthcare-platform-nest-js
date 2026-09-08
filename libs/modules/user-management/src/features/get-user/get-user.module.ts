import { Module } from '@nestjs/common';
import { GetUserController } from './api/http/v1/get-user.controller';
import { GetUserHandler } from './application/get-user.handler';

@Module({
  controllers: [GetUserController],
  providers: [GetUserHandler],
})
export class GetUserModule {}
