import { Module } from '@nestjs/common';
import { LogoutController } from './api/http/v1/logout.controller';
import { LogoutHandler } from './application/logout.handler';

@Module({
  controllers: [LogoutController],
  providers: [LogoutHandler],
})
export class LogoutModule {}
