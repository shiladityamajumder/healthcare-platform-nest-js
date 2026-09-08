import { Module } from '@nestjs/common';
import { PreferencesController } from './api/http/v1/preferences.controller';
import { PreferencesHandler } from './application/preferences.handler';

@Module({
  controllers: [PreferencesController],
  providers: [PreferencesHandler],
})
export class PreferencesModule {}
