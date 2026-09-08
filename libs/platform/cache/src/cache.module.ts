import { Global, Inject, Injectable, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Injectable()
export class RedisClient implements OnModuleInit, OnModuleDestroy {
  public constructor(
    @Inject(REDIS_CLIENT) private readonly client: Redis | null,
    private readonly config: ConfigService,
  ) {}

  public async onModuleInit(): Promise<void> {
    if (this.client) await this.client.ping();
  }

  public async onModuleDestroy(): Promise<void> {
    if (this.client) await this.client.quit();
  }

  public get connection(): Redis {
    if (!this.client) throw new Error('Redis is disabled. Set REDIS_ENABLED=true to use it.');
    return this.client;
  }

  public get isEnabled(): boolean {
    return this.client !== null;
  }

  public buildKey(...parts: string[]): string {
    if (parts.length === 0 || parts.some((part) => !part.trim() || part.includes(':'))) {
      throw new Error('Redis key segments must be non-empty and must not contain ":".');
    }
    return [this.config.get<string>('REDIS_KEY_PREFIX') ?? 'healthcare', ...parts].join(':');
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Redis | null => {
        if (!isEnabled(config.get<string>('REDIS_ENABLED'))) return null;

        const url = config.get<string>('REDIS_URL');
        if (!url) throw new Error('REDIS_URL is required when REDIS_ENABLED=true.');

        return new Redis(url, {
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          lazyConnect: true,
        });
      },
    },
    RedisClient,
  ],
  exports: [REDIS_CLIENT, RedisClient],
})
export class CacheModule {}

function isEnabled(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}
