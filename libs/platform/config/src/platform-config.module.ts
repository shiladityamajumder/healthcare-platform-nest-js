// * Provides environment configuration for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { platformConfiguration } from './platform-configuration';

// * Validates that PostgreSQL is configured either through a connection URL or discrete settings.
// ! Fail fast during startup so the application does not run with an unusable database configuration.
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
