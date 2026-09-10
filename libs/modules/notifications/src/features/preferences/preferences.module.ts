// Linked with: @nestjs/common, ./api/http/v1/preferences.controller, ./application/preferences.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { PreferencesController } from './api/http/v1/preferences.controller';
import { PreferencesHandler } from './application/preferences.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [PreferencesController],
  providers: [PreferencesHandler],
})
export class PreferencesModule {}
