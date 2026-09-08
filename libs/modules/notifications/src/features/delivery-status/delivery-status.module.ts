import { Module } from '@nestjs/common';
import { DeliveryStatusController } from './api/http/v1/delivery-status.controller';
import { DeliveryStatusHandler } from './application/delivery-status.handler';

@Module({
  controllers: [DeliveryStatusController],
  providers: [DeliveryStatusHandler],
})
export class DeliveryStatusModule {}
