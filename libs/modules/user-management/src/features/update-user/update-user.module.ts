import { Module } from '@nestjs/common';
import { UpdateUserController } from './api/http/v1/update-user.controller';
import { UpdateUserHandler } from './application/update-user.handler';

@Module({
  controllers: [UpdateUserController],
  providers: [UpdateUserHandler],
})
export class UpdateUserModule {}
