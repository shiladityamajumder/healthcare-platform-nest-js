import { Module } from '@nestjs/common';
import { UpdateProfileController } from './api/http/v1/update-profile.controller';
import { UpdateProfileHandler } from './application/update-profile.handler';

@Module({
  controllers: [UpdateProfileController],
  providers: [UpdateProfileHandler],
})
export class UpdateProfileModule {}
