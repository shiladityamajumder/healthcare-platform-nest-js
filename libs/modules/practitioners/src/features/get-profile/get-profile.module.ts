import { Module } from '@nestjs/common';
import { GetProfileController } from './api/http/v1/get-profile.controller';
import { GetProfileHandler } from './application/get-profile.handler';

@Module({
  controllers: [GetProfileController],
  providers: [GetProfileHandler],
})
export class GetProfileModule {}
