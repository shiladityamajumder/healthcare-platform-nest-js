// * Linked with: @nestjs/common, @nestjs/config, ./platform-configuration.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { platformConfiguration } from './platform-configuration';

// * Register the feature components and their dependencies with NestJS.
function validateEnvironment(config: Record<string, unknown>): Record<string, unknown> {
  if (config.DATABASE_URL) return config;

  const required = ['DATABASE_HOST', 'DATABASE_NAME', 'DATABASE_USER', 'DATABASE_PASSWORD'];
  const missing = required.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  return config;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [platformConfiguration],
      validate: validateEnvironment,
    }),
  ],
})
export class PlatformConfigModule {}
