import { Module } from '@nestjs/common';
import { CreateProfileController } from './api/http/v1/create-profile.controller';
import { CreateProfileHandler } from './application/create-profile.handler';

@Module({
  controllers: [CreateProfileController],
  providers: [CreateProfileHandler],
})
export class CreateProfileModule {}
