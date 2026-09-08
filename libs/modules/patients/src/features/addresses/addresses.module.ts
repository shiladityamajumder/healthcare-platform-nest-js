import { Module } from '@nestjs/common';
import { AddressesController } from './api/http/v1/addresses.controller';
import { AddressesHandler } from './application/addresses.handler';

@Module({
  controllers: [AddressesController],
  providers: [AddressesHandler],
})
export class AddressesModule {}
