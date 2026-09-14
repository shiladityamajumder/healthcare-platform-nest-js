// * Provides database connectivity and transaction support for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import type { ConfigService } from '@nestjs/config';
import type { PoolConfig } from 'pg';

// * Builds the pg connection-pool options from either DATABASE_URL or discrete settings.
// ? SSL, pool size, channel binding, and endpoint options remain deployment-configurable.
export function postgresOptions(config: ConfigService): PoolConfig {
  const databaseUrl = config
    .get<string>('DATABASE_URL')
    ?.replace(/^postgresql\+asyncpg:\/\//, 'postgresql://');
  const sslEnabled = config.get<string>('DATABASE_SSL') === 'true';
  const rejectUnauthorized = config.get<string>('DATABASE_SSL_REJECT_UNAUTHORIZED') !== 'false';
  const endpointId = config.get<string>('DATABASE_ENDPOINT_ID');
  const enableChannelBinding = databaseUrl?.includes('channel_binding=require') ?? false;

  return {
    ...(databaseUrl
      ? { connectionString: databaseUrl }
      : {
          host: config.getOrThrow<string>('DATABASE_HOST'),
          port: Number(config.get<string>('DATABASE_PORT') ?? 5432),
          database: config.getOrThrow<string>('DATABASE_NAME'),
          user: config.getOrThrow<string>('DATABASE_USER'),
          password: config.getOrThrow<string>('DATABASE_PASSWORD'),
        }),
    ssl: sslEnabled ? { rejectUnauthorized } : false,
    max: Number(config.get<string>('DATABASE_POOL_SIZE') ?? 20),
    ...(enableChannelBinding ? { enableChannelBinding: true } : {}),
    ...(endpointId ? { options: `endpoint=${endpointId}` } : {}),
  };
}
