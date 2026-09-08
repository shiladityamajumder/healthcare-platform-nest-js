import { Module } from '@nestjs/common';
import { ReturnsController } from './api/http/v1/returns.controller';
import { ReturnsHandler } from './application/returns.handler';

@Module({
  controllers: [ReturnsController],
  providers: [ReturnsHandler],
})
export class ReturnsModule {}
