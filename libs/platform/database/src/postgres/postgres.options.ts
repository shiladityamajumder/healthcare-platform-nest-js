// Linked with: @nestjs/config, pg.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import type { ConfigService } from '@nestjs/config';
import type { PoolConfig } from 'pg';

// Define the shared types or behavior used by the surrounding package.
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
