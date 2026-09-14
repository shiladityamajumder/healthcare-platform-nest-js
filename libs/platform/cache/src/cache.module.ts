// * Provides Redis cache integration for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { Global, Inject, Injectable, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Injectable()
export class RedisClient implements OnModuleInit, OnModuleDestroy {
  // * Receives the optional Redis client and configuration used by the cache wrapper.
  public constructor(
    @Inject(REDIS_CLIENT) private readonly client: Redis | null,
    private readonly config: ConfigService,
  ) {}

  // * Verifies the optional Redis connection when the cache client is enabled.
  public async onModuleInit(): Promise<void> {
    if (this.client) await this.client.ping();
  }

  // * Closes the Redis connection during graceful application shutdown.
  public async onModuleDestroy(): Promise<void> {
    if (this.client) await this.client.quit();
  }

  // * Returns the Redis client and fails clearly when caching is disabled.
  public get connection(): Redis {
    if (!this.client) throw new Error('Redis is disabled. Set REDIS_ENABLED=true to use it.');
    return this.client;
  }

  // * Reports whether Redis was configured and injected into the client wrapper.
  public get isEnabled(): boolean {
    return this.client !== null;
  }

  // * Builds a namespaced Redis key while rejecting ambiguous or unsafe key segments.
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
      // * Creates the optional Redis client from the configured URL and retry policy.
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

// * Interprets the supported environment representations for the Redis enabled flag.
function isEnabled(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}
