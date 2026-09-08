import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { platformConfiguration } from './platform-configuration';

function validateEnvironment(config: Record<string, unknown>): Record<string, unknown> {
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
