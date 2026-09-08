import { Module } from '@nestjs/common';
import { RefreshTokenController } from './api/http/v1/refresh-token.controller';
import { RefreshTokenHandler } from './application/refresh-token.handler';

@Module({
  controllers: [RefreshTokenController],
  providers: [RefreshTokenHandler],
})
export class RefreshTokenModule {}
