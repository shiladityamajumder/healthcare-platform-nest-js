import { Module } from '@nestjs/common';
import { ListUsersController } from './api/http/v1/list-users.controller';
import { ListUsersHandler } from './application/list-users.handler';

@Module({
  controllers: [ListUsersController],
  providers: [ListUsersHandler],
})
export class ListUsersModule {}
