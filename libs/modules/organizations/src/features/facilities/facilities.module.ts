import { Module } from '@nestjs/common';
import { FacilitiesController } from './api/http/v1/facilities.controller';
import { FacilitiesHandler } from './application/facilities.handler';

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesHandler],
})
export class FacilitiesModule {}
