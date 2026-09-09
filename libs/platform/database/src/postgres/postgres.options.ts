import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function postgresOptions(config: ConfigService): TypeOrmModuleOptions {
  const databaseUrl = config
    .get<string>('DATABASE_URL')
    ?.replace(/^postgresql\+asyncpg:\/\//, 'postgresql://');
  const sslEnabled = config.get<string>('DATABASE_SSL') === 'true';
  const rejectUnauthorized = config.get<string>('DATABASE_SSL_REJECT_UNAUTHORIZED') !== 'false';
  const endpointId = config.get<string>('DATABASE_ENDPOINT_ID');
  const enableChannelBinding = databaseUrl?.includes('channel_binding=require') ?? false;

  return {
    type: 'postgres',
    ...(databaseUrl
      ? { url: databaseUrl }
      : {
          host: config.getOrThrow<string>('DATABASE_HOST'),
          port: Number(config.get<string>('DATABASE_PORT') ?? 5432),
          database: config.getOrThrow<string>('DATABASE_NAME'),
          username: config.getOrThrow<string>('DATABASE_USER'),
          password: config.getOrThrow<string>('DATABASE_PASSWORD'),
        }),
    ssl: sslEnabled ? { rejectUnauthorized } : false,
    autoLoadEntities: true,
    synchronize: false,
    logging: false,
    extra: {
      max: Number(config.get<string>('DATABASE_POOL_SIZE') ?? 20),
      ...(enableChannelBinding ? { enableChannelBinding: true } : {}),
      ...(endpointId ? { options: `endpoint=${endpointId}` } : {}),
    },
  };
}
