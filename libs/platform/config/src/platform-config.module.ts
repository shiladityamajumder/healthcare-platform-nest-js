// Provides the single validated environment configuration to every module.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { platformConfiguration, validatePlatformConfiguration } from './platform-configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [platformConfiguration],
      validate: validatePlatformConfiguration,
    }),
  ],
})
export class PlatformConfigModule {}
