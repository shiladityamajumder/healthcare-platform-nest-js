import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function postgresOptions(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: config.getOrThrow<string>('DATABASE_HOST'),
    port: Number(config.get<string>('DATABASE_PORT') ?? 5432),
    database: config.getOrThrow<string>('DATABASE_NAME'),
    username: config.getOrThrow<string>('DATABASE_USER'),
    password: config.getOrThrow<string>('DATABASE_PASSWORD'),
    ssl: config.get<string>('DATABASE_SSL') === 'true',
    autoLoadEntities: true,
    synchronize: false,
    logging: false,
    extra: { max: Number(config.get<string>('DATABASE_POOL_SIZE') ?? 20) },
  };
}
