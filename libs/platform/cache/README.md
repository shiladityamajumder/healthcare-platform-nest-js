# Cache platform library

<p><img src="https://img.shields.io/badge/Platform-Optional%20Redis-DC382D?logo=redis&logoColor=white" alt="Optional Redis cache platform" /></p>

Optional Redis integration for application-wide caching and distributed coordination. This library is technical infrastructure only and must not import a business bounded context.

## Current implementation

`CacheModule` is global and exports `REDIS_CLIENT` plus `RedisClient`. Redis is disabled unless `REDIS_ENABLED=true` or `1`; when enabled, the module validates `REDIS_URL`, creates a lazy `ioredis` client, pings it during module initialization, and quits it during shutdown.

`RedisClient.connection` throws a clear error when Redis is disabled. `buildKey(...parts)` prefixes keys with `REDIS_KEY_PREFIX` and rejects empty segments or segments containing `:`. No current business feature depends on Redis.

Configure the adapter with `REDIS_URL`, `REDIS_KEY_PREFIX`, and the Redis settings in `.env.example`. Do not put credentials or sensitive payloads in cache keys.
