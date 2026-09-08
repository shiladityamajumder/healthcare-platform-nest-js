import { Module } from '@nestjs/common';
import { UpdateStatusController } from './api/http/v1/update-status.controller';
import { UpdateStatusHandler } from './application/update-status.handler';

@Module({
  controllers: [UpdateStatusController],
  providers: [UpdateStatusHandler],
})
export class UpdateStatusModule {}
