// * Linked with: the surrounding package and its exported types.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
export interface PlatformConfiguration {
  app: {
    environment: string;
    port: number;
    apiPrefix: string;
    apiVersion: string;
  };
  database: {
    postgres: {
      host: string;
      port: number;
      name: string;
      user: string;
      ssl: boolean;
      poolSize: number;
    };
    mongo: {
      enabled: boolean;
      uri?: string;
      database?: string;
    };
  };
  cache: {
    redis: {
      enabled: boolean;
      url?: string;
      keyPrefix: string;
      defaultTtlSeconds: number;
    };
  };
  logging: {
    level: string;
  };
}

// * Define the shared types or behavior used by the surrounding package.
export function platformConfiguration(): PlatformConfiguration {
  return {
    app: {
      environment: process.env.NODE_ENV ?? 'development',
      port: numberFromEnv('PORT', 3000),
      apiPrefix: process.env.API_PREFIX ?? 'api',
      apiVersion: process.env.API_VERSION ?? '1',
    },
    database: {
      postgres: {
        host: process.env.DATABASE_HOST ?? 'localhost',
        port: numberFromEnv('DATABASE_PORT', 5432),
        name: process.env.DATABASE_NAME ?? 'healthcare',
        user: process.env.DATABASE_USER ?? 'postgres',
        ssl: booleanFromEnv('DATABASE_SSL', false),
        poolSize: numberFromEnv('DATABASE_POOL_SIZE', 20),
      },
      mongo: {
        enabled: booleanFromEnv('MONGO_ENABLED', false),
        uri: process.env.MONGO_URI,
        database: process.env.MONGO_DATABASE,
      },
    },
    cache: {
      redis: {
        enabled: booleanFromEnv('REDIS_ENABLED', false),
        url: process.env.REDIS_URL,
        keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'healthcare',
        defaultTtlSeconds: numberFromEnv('REDIS_DEFAULT_TTL_SECONDS', 300),
      },
    },
    logging: {
      level: process.env.LOG_LEVEL ?? 'info',
    },
  };
}

function numberFromEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function booleanFromEnv(name: string, fallback: boolean): boolean {
  const value = process.env[name]?.toLowerCase();
  if (!value) return fallback;
  return value === 'true' || value === '1';
}
