import { Module } from '@nestjs/common';
import { CreateUserController } from './api/http/v1/create-user.controller';
import { CreateUserHandler } from './application/create-user.handler';

@Module({
  controllers: [CreateUserController],
  providers: [CreateUserHandler],
})
export class CreateUserModule {}
