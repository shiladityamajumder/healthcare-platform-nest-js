/**
 * Single, process-wide configuration contract for the healthcare platform.
 *
 * The object is grouped by responsibility, while environment variable names
 * remain flat for deployment compatibility. Optional dependencies are guarded
 * by explicit enabled flags: disabled integrations do not require connection
 * settings and must fail only when an API attempts to use them; enabled
 * integrations are validated while Nest is starting.
 *
 * This module only parses and validates configuration. It never connects to a
 * service, creates a client, creates a directory, or mutates external state.
 */

export type PlatformEnvironment = 'development' | 'testing' | 'staging' | 'production';

export interface PlatformConfiguration {
  // Application identity and process lifecycle.
  app: {
    name: string;
    version: string;
    environment: PlatformEnvironment;
    timezone: string;
    publicBaseUrl: string;
    host: string;
    port: number;
    shutdownTimeoutMs: number;
  };

  // HTTP API, documentation, and browser access policy.
  http: {
    apiPrefix: string;
    apiVersion: string;
    docsEnabled: boolean;
    corsOrigins: string[];
    corsAllowCredentials: boolean;
    maxRequestBodyBytes: number;
    secureHeadersEnabled: boolean;
    hstsEnabled: boolean;
    trustProxy: boolean;
    trustedProxyIps: string[];
  };

  // Logging and operational diagnostics.
  logging: {
    level: string;
    json: boolean;
    toFile: boolean;
    directory: string;
    file: string;
    maxBytes: number;
    backupCount: number;
    queueSize: number;
    sensitiveDataRedactionEnabled: boolean;
    slowRequestThresholdMs: number;
  };

  // Health and readiness behavior.
  health: {
    checkTimeoutMs: number;
    deepChecksEnabled: boolean;
  };

  // Persistence. The master switch can stop all database clients.
  database: {
    enabled: boolean;
    postgres: {
      enabled: boolean;
      url?: string;
      host: string;
      port: number;
      name: string;
      user: string;
      password?: string;
      ssl: boolean;
      sslRejectUnauthorized: boolean;
      endpointId?: string;
      poolSize: number;
      maxOverflow: number;
      poolTimeoutMs: number;
      idleTimeoutMs: number;
      connectTimeoutMs: number;
      commandTimeoutMs: number;
    };
    mongo: {
      enabled: boolean;
      uri?: string;
      database?: string;
      minPoolSize: number;
      maxPoolSize: number;
      serverSelectionTimeoutMs: number;
      connectTimeoutMs: number;
      socketTimeoutMs: number;
      retryReads: boolean;
      retryWrites: boolean;
    };
  };

  // Cache and distributed coordination.
  cache: {
    redis: {
      enabled: boolean;
      url?: string;
      keyPrefix: string;
      defaultTtlSeconds: number;
      maxConnections: number;
      connectTimeoutMs: number;
      commandTimeoutMs: number;
      healthCheckIntervalSeconds: number;
    };
  };

  // Authentication and authorization policy.
  auth: {
    enabled: boolean;
    jwt: {
      accessSecret?: string;
      refreshSecret?: string;
      passwordResetSecret?: string;
      issuer: string;
      audience: string;
      accessTtlSeconds: number;
      refreshTtlSeconds: number;
      passwordResetTtlSeconds: number;
    };
    password: {
      pepper?: string;
      minimumLength: number;
      historyCount: number;
      maxFailedAttempts: number;
      lockoutMinutes: number;
    };
    verification: { emailRequired: boolean; phoneRequired: boolean };
    otp: {
      ttlSeconds: number;
      maxAttempts: number;
      resendCooldownSeconds: number;
      maxResends: number;
      resendWindowSeconds: number;
      exposeCode: boolean;
    };
    roles: { defaultRoleCode: string };
  };
}

type EnvironmentInput = Record<string, unknown>;

const MAX_SQL_CONNECTIONS_PER_PROCESS = 200;
const VALID_ENVIRONMENTS = new Set<PlatformEnvironment>([
  'development',
  'testing',
  'staging',
  'production',
]);
const VALID_LOG_LEVELS = new Set(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent']);

/** Build the normalized configuration used by the Nest ConfigModule. */
export function platformConfiguration(
  environment: EnvironmentInput = process.env,
): PlatformConfiguration {
  const databaseEnabled = booleanFromEnv(environment, 'DATABASE_ENABLED', true);
  const postgresEnabled = databaseEnabled && booleanFromEnv(environment, 'POSTGRES_ENABLED', true);
  const mongoEnabled = databaseEnabled && booleanFromEnv(environment, 'MONGO_ENABLED', false);
  const redisEnabled = booleanFromEnv(environment, 'REDIS_ENABLED', false);
  const authEnabled = booleanFromEnv(environment, 'AUTH_ENABLED', true);
  // Resolve master switches first so a disabled parent integration cannot be
  // re-enabled accidentally by one of its child flags.
  const sharedJwtSecret = optionalStringFromEnv(environment, 'JWT_SECRET');

  // Build one normalized object. Consumers should use this structured contract
  // instead of parsing environment variables again.
  const configuration: PlatformConfiguration = {
    // Application identity and process lifecycle settings.
    app: {
      name: stringFromEnv(environment, 'APP_NAME', 'Healthcare Platform API'),
      version: stringFromEnv(environment, 'APP_VERSION', '1.0.0'),
      environment: environmentFromEnv(environment, 'NODE_ENV', 'development'),
      timezone: stringFromEnv(environment, 'TIMEZONE', 'Asia/Kolkata'),
      publicBaseUrl: stringFromEnv(environment, 'PUBLIC_BASE_URL', 'http://localhost:3000'),
      host: stringFromEnv(environment, 'HOST', '0.0.0.0'),
      port: numberFromEnv(environment, 'PORT', 3000, 1, 65_535),
      shutdownTimeoutMs: numberFromEnv(environment, 'SHUTDOWN_TIMEOUT_MS', 10_000, 100, 300_000),
    },
    // Public API routing, documentation, CORS, proxy, and HTTP hardening.
    http: {
      apiPrefix: normalizePath(stringFromEnv(environment, 'API_PREFIX', 'api'), 'API_PREFIX'),
      apiVersion: stringFromEnv(environment, 'API_VERSION', '1'),
      docsEnabled: booleanFromEnv(environment, 'DOCS_ENABLED', true),
      corsOrigins: listFromEnv(environment, 'CORS_ORIGINS', []),
      corsAllowCredentials: booleanFromEnv(environment, 'CORS_ALLOW_CREDENTIALS', false),
      maxRequestBodyBytes: numberFromEnv(
        environment,
        'MAX_REQUEST_BODY_BYTES',
        2_097_152,
        1,
        100_000_000,
      ),
      secureHeadersEnabled: booleanFromEnv(environment, 'SECURE_HEADERS_ENABLED', true),
      hstsEnabled: booleanFromEnv(environment, 'HSTS_ENABLED', false),
      trustProxy: booleanFromEnv(environment, 'TRUST_PROXY', false),
      trustedProxyIps: listFromEnv(environment, 'TRUSTED_PROXY_IPS', []),
    },
    // Logging output and request-observability thresholds. This section does
    // not create files or transports by itself.
    logging: {
      level: stringFromEnv(environment, 'LOG_LEVEL', 'info').toLowerCase(),
      json: booleanFromEnv(environment, 'LOG_JSON', false),
      toFile: booleanFromEnv(environment, 'LOG_TO_FILE', false),
      directory: stringFromEnv(environment, 'LOG_DIR', 'logs'),
      file: stringFromEnv(environment, 'LOG_FILE', 'app.log'),
      maxBytes: numberFromEnv(environment, 'LOG_MAX_BYTES', 10_000_000, 1, 1_000_000_000),
      backupCount: numberFromEnv(environment, 'LOG_BACKUP_COUNT', 5, 0, 100),
      queueSize: numberFromEnv(environment, 'LOG_QUEUE_SIZE', 10_000, 100, 1_000_000),
      sensitiveDataRedactionEnabled: booleanFromEnv(
        environment,
        'SENSITIVE_DATA_REDACTION_ENABLED',
        true,
      ),
      slowRequestThresholdMs: numberFromEnv(
        environment,
        'SLOW_REQUEST_THRESHOLD_MS',
        1_000,
        1,
        60_000,
      ),
    },
    // Health endpoint behavior. Actual dependency connectivity checks belong
    // to the health layer, not to configuration construction.
    health: {
      checkTimeoutMs: numberFromEnv(environment, 'HEALTHCHECK_TIMEOUT_MS', 3_000, 100, 60_000),
      deepChecksEnabled: booleanFromEnv(environment, 'DEEP_HEALTH_ENABLED', true),
    },
    // Persistence settings. The master switch controls all database clients;
    // child flags allow optional stores to be disabled independently.
    database: {
      enabled: databaseEnabled,
      // PostgreSQL is the primary persistence store.
      postgres: {
        enabled: postgresEnabled,
        url: optionalStringFromEnv(environment, 'DATABASE_URL'),
        host: stringFromEnv(environment, 'DATABASE_HOST', 'localhost'),
        port: numberFromEnv(environment, 'DATABASE_PORT', 5432, 1, 65_535),
        name: stringFromEnv(environment, 'DATABASE_NAME', 'healthcare'),
        user: stringFromEnv(environment, 'DATABASE_USER', 'postgres'),
        password: optionalStringFromEnv(environment, 'DATABASE_PASSWORD'),
        ssl: booleanFromEnv(environment, 'DATABASE_SSL', false),
        sslRejectUnauthorized: booleanFromEnv(
          environment,
          'DATABASE_SSL_REJECT_UNAUTHORIZED',
          true,
        ),
        endpointId: optionalStringFromEnv(environment, 'DATABASE_ENDPOINT_ID'),
        poolSize: numberFromEnv(environment, 'DATABASE_POOL_SIZE', 20, 1, 200),
        maxOverflow: numberFromEnv(environment, 'DATABASE_MAX_OVERFLOW', 10, 0, 200),
        poolTimeoutMs: numberFromEnv(environment, 'DATABASE_POOL_TIMEOUT_MS', 10_000, 100, 300_000),
        idleTimeoutMs: numberFromEnv(environment, 'DATABASE_IDLE_TIMEOUT_MS', 30_000, 0, 300_000),
        connectTimeoutMs: numberFromEnv(
          environment,
          'DATABASE_CONNECT_TIMEOUT_MS',
          5_000,
          100,
          60_000,
        ),
        commandTimeoutMs: numberFromEnv(
          environment,
          'DATABASE_COMMAND_TIMEOUT_MS',
          15_000,
          100,
          300_000,
        ),
      },
      // MongoDB is an optional secondary store and is disabled by default.
      mongo: {
        enabled: mongoEnabled,
        uri: optionalStringFromEnv(environment, 'MONGO_URI'),
        database: optionalStringFromEnv(environment, 'MONGO_DATABASE'),
        minPoolSize: numberFromEnv(environment, 'MONGO_MIN_POOL_SIZE', 0, 0, 500),
        maxPoolSize: numberFromEnv(environment, 'MONGO_MAX_POOL_SIZE', 20, 1, 500),
        serverSelectionTimeoutMs: numberFromEnv(
          environment,
          'MONGO_SERVER_SELECTION_TIMEOUT_MS',
          5_000,
          100,
          300_000,
        ),
        connectTimeoutMs: numberFromEnv(
          environment,
          'MONGO_CONNECT_TIMEOUT_MS',
          5_000,
          100,
          300_000,
        ),
        socketTimeoutMs: numberFromEnv(
          environment,
          'MONGO_SOCKET_TIMEOUT_MS',
          15_000,
          100,
          600_000,
        ),
        retryReads: booleanFromEnv(environment, 'MONGO_RETRY_READS', true),
        retryWrites: booleanFromEnv(environment, 'MONGO_RETRY_WRITES', true),
      },
    },
    // Optional cache and distributed coordination settings.
    cache: {
      redis: {
        enabled: redisEnabled,
        url: optionalStringFromEnv(environment, 'REDIS_URL'),
        keyPrefix: stringFromEnv(environment, 'REDIS_KEY_PREFIX', 'healthcare'),
        defaultTtlSeconds: numberFromEnv(environment, 'REDIS_DEFAULT_TTL_SECONDS', 300, 1, 86_400),
        maxConnections: numberFromEnv(environment, 'REDIS_MAX_CONNECTIONS', 50, 1, 1_000),
        connectTimeoutMs: numberFromEnv(
          environment,
          'REDIS_CONNECT_TIMEOUT_MS',
          3_000,
          100,
          60_000,
        ),
        commandTimeoutMs: numberFromEnv(
          environment,
          'REDIS_COMMAND_TIMEOUT_MS',
          3_000,
          100,
          60_000,
        ),
        healthCheckIntervalSeconds: numberFromEnv(
          environment,
          'REDIS_HEALTH_CHECK_INTERVAL_SECONDS',
          30,
          0,
          3_600,
        ),
      },
    },
    // Authentication and authorization policy.
    auth: {
      enabled: authEnabled,
      // Separate secrets support independent token rotation. JWT_SECRET remains
      // a compatibility fallback for existing deployments.
      jwt: {
        accessSecret: optionalStringFromEnv(environment, 'JWT_ACCESS_SECRET', sharedJwtSecret),
        refreshSecret: optionalStringFromEnv(environment, 'JWT_REFRESH_SECRET', sharedJwtSecret),
        passwordResetSecret: optionalStringFromEnv(
          environment,
          'JWT_PASSWORD_RESET_SECRET',
          sharedJwtSecret,
        ),
        issuer: stringFromEnv(environment, 'JWT_ISSUER', 'healthcare-platform'),
        audience: stringFromEnv(environment, 'JWT_AUDIENCE', 'healthcare-platform'),
        accessTtlSeconds: numberFromEnv(environment, 'JWT_ACCESS_TTL_SECONDS', 900, 1, 86_400),
        refreshTtlSeconds: numberFromEnv(
          environment,
          'JWT_REFRESH_TTL_SECONDS',
          2_592_000,
          1,
          31_536_000,
        ),
        passwordResetTtlSeconds: numberFromEnv(
          environment,
          'PASSWORD_RESET_TOKEN_TTL_SECONDS',
          900,
          1,
          86_400,
        ),
      },
      password: {
        pepper: optionalStringFromEnv(environment, 'AUTH_PEPPER'),
        minimumLength: numberFromEnv(environment, 'PASSWORD_MIN_LENGTH', 12, 8, 128),
        historyCount: numberFromEnv(environment, 'PASSWORD_HISTORY_COUNT', 5, 0, 24),
        maxFailedAttempts: numberFromEnv(environment, 'LOGIN_MAX_FAILED_ATTEMPTS', 5, 2, 20),
        lockoutMinutes: numberFromEnv(environment, 'LOGIN_LOCKOUT_MINUTES', 15, 1, 1_440),
      },
      verification: {
        emailRequired: booleanFromEnv(environment, 'EMAIL_VERIFICATION_REQUIRED', true),
        phoneRequired: booleanFromEnv(environment, 'PHONE_VERIFICATION_REQUIRED', true),
      },
      otp: {
        ttlSeconds: numberFromEnv(environment, 'OTP_TTL_SECONDS', 300, 60, 900),
        maxAttempts: numberFromEnv(environment, 'OTP_MAX_ATTEMPTS', 5, 2, 10),
        resendCooldownSeconds: numberFromEnv(
          environment,
          'OTP_RESEND_COOLDOWN_SECONDS',
          60,
          1,
          600,
        ),
        maxResends: numberFromEnv(environment, 'OTP_MAX_RESENDS', 5, 1, 20),
        resendWindowSeconds: numberFromEnv(
          environment,
          'OTP_RESEND_WINDOW_SECONDS',
          3_600,
          300,
          86_400,
        ),
        exposeCode: booleanFromEnv(environment, 'OTP_DEV_EXPOSE_CODE', false),
      },
      roles: { defaultRoleCode: stringFromEnv(environment, 'DEFAULT_ROLE_CODE', 'customer') },
    },
  };

  // Validate after normalization so every rule operates on typed values and
  // reports all detected startup problems together.
  validateConfiguration(configuration);
  return configuration;
}

/** Nest validate hook; returns the flat map for backward-compatible consumers. */
export function validatePlatformConfiguration(environment: EnvironmentInput): EnvironmentInput {
  // Nest expects this hook to return the flat environment map. Building the
  // structured object here keeps validation identical to the factory path.
  platformConfiguration(environment);
  return environment;
}

function validateConfiguration(configuration: PlatformConfiguration): void {
  const errors: string[] = [];
  const { app, http, logging, database, cache, auth } = configuration;

  if (http.corsAllowCredentials && http.corsOrigins.includes('*')) {
    errors.push('CORS_ORIGINS cannot contain "*" when CORS_ALLOW_CREDENTIALS=true');
  }
  if (http.trustProxy && http.trustedProxyIps.length === 0) {
    errors.push('TRUSTED_PROXY_IPS is required when TRUST_PROXY=true');
  }
  if (
    database.postgres.poolSize + database.postgres.maxOverflow >
    MAX_SQL_CONNECTIONS_PER_PROCESS
  ) {
    errors.push(
      `DATABASE_POOL_SIZE plus DATABASE_MAX_OVERFLOW must not exceed ${MAX_SQL_CONNECTIONS_PER_PROCESS}`,
    );
  }
  if (database.mongo.minPoolSize > database.mongo.maxPoolSize) {
    errors.push('MONGO_MIN_POOL_SIZE must not exceed MONGO_MAX_POOL_SIZE');
  }

  // Required connection values are conditional. This allows a degraded API
  // process to start when an optional dependency is disabled.
  // Disabled integrations intentionally do not require connection settings.
  if (database.postgres.enabled) {
    if (!database.postgres.url) {
      requireValue(database.postgres.host, 'DATABASE_HOST', errors);
      requireValue(database.postgres.name, 'DATABASE_NAME', errors);
      requireValue(database.postgres.user, 'DATABASE_USER', errors);
      requireValue(database.postgres.password, 'DATABASE_PASSWORD', errors);
    } else if (!isPostgresUrl(database.postgres.url)) {
      errors.push('DATABASE_URL must be a valid PostgreSQL connection URL');
    }
  }
  if (database.mongo.enabled) {
    requireValue(database.mongo.uri, 'MONGO_URI', errors);
    requireValue(database.mongo.database, 'MONGO_DATABASE', errors);
    if (database.mongo.uri && !isMongoUrl(database.mongo.uri)) {
      errors.push('MONGO_URI must be a valid MongoDB connection URL');
    }
  }
  if (cache.redis.enabled) {
    requireValue(cache.redis.url, 'REDIS_URL', errors);
    if (cache.redis.url && !isRedisUrl(cache.redis.url)) {
      errors.push('REDIS_URL must be a valid Redis connection URL');
    }
  }
  if (auth.enabled) {
    requireValue(auth.jwt.accessSecret, 'JWT_ACCESS_SECRET or JWT_SECRET', errors);
    requireValue(auth.jwt.refreshSecret, 'JWT_REFRESH_SECRET or JWT_SECRET', errors);
    requireValue(auth.password.pepper, 'AUTH_PEPPER', errors);
  }
  if (!VALID_LOG_LEVELS.has(logging.level)) {
    errors.push(`LOG_LEVEL must be one of: ${[...VALID_LOG_LEVELS].join(', ')}`);
  }

  // Production has stricter operational and security requirements than local
  // development and automated testing environments.
  if (app.environment === 'production') {
    if (!http.secureHeadersEnabled)
      errors.push('SECURE_HEADERS_ENABLED must be true in production');
    if (!http.hstsEnabled) errors.push('HSTS_ENABLED must be true in production');
    if (!logging.json) errors.push('LOG_JSON must be true in production');
    if (logging.toFile) errors.push('LOG_TO_FILE must be false in production containers');
    if (http.docsEnabled) errors.push('DOCS_ENABLED must be false in production');
    if (auth.otp.exposeCode) errors.push('OTP_DEV_EXPOSE_CODE must be false in production');
    if (isPlaceholderSecret(auth.jwt.accessSecret) || isPlaceholderSecret(auth.password.pepper)) {
      errors.push('Production authentication secrets must not use placeholders');
    }
  }

  if (errors.length > 0)
    throw new Error(`Invalid platform configuration:\n- ${errors.join('\n- ')}`);
}

function requireValue(value: string | undefined, name: string, errors: string[]): void {
  // Keep field names in errors without exposing secret values.
  if (!value?.trim()) errors.push(`${name} is required when its integration is enabled`);
}

function environmentFromEnv(
  environment: EnvironmentInput,
  name: string,
  fallback: PlatformEnvironment,
): PlatformEnvironment {
  const value = stringFromEnv(environment, name, fallback).toLowerCase() as PlatformEnvironment;
  if (!VALID_ENVIRONMENTS.has(value))
    throw new Error(`${name} must be a supported runtime environment`);
  return value;
}

function stringFromEnv(environment: EnvironmentInput, name: string, fallback: string): string {
  // Treat blank values as missing so accidental `.env` whitespace does not
  // silently override a safe default.
  const value = environment[name];
  return value === undefined || value === null || String(value).trim() === ''
    ? fallback
    : String(value).trim();
}

function optionalStringFromEnv(
  environment: EnvironmentInput,
  name: string,
  fallback?: string,
): string | undefined {
  // Optional URLs and secrets become undefined when blank, making conditional
  // validation explicit and avoiding empty values in client constructors.
  const value = environment[name];
  if (value !== undefined && value !== null && String(value).trim() !== '')
    return String(value).trim();
  return fallback?.trim() || undefined;
}

function numberFromEnv(
  environment: EnvironmentInput,
  name: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  // Invalid numbers fail fast instead of silently falling back to an unsafe
  // pool size or timeout.
  const raw = environment[name];
  const value =
    raw === undefined || raw === null || String(raw).trim() === '' ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${name} must be an integer between ${minimum} and ${maximum}`);
  }
  return value;
}

function booleanFromEnv(environment: EnvironmentInput, name: string, fallback: boolean): boolean {
  // Accept common deployment representations, but reject typos such as `ture`
  // instead of silently treating them as false.
  const raw = environment[name];
  if (raw === undefined || raw === null || String(raw).trim() === '') return fallback;
  const value = String(raw).trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(value)) return true;
  if (['false', '0', 'no', 'off'].includes(value)) return false;
  throw new Error(`${name} must be a boolean (true/false)`);
}

function listFromEnv(environment: EnvironmentInput, name: string, fallback: string[]): string[] {
  // Support comma-separated values and JSON arrays, then normalize whitespace
  // and remove duplicates.
  const raw = environment[name];
  if (raw === undefined || raw === null || String(raw).trim() === '') return fallback;
  let values: unknown[];
  if (Array.isArray(raw)) values = raw;
  else {
    const text = String(raw).trim();
    try {
      const parsed: unknown = JSON.parse(text);
      values = Array.isArray(parsed) ? parsed : text.split(',');
    } catch {
      values = text.split(',');
    }
  }
  return [
    ...new Set(
      values
        .map(String)
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ];
}

function normalizePath(value: string, name: string): string {
  // Store route prefixes without leading/trailing slashes so URL composition is
  // consistent across bootstrap and controllers.
  const normalized = value.replace(/^\/+|\/+$/g, '');
  if (!normalized) throw new Error(`${name} must not be the root path`);
  return normalized;
}

function isPostgresUrl(value: string): boolean {
  try {
    const url = new URL(value.replace(/^postgresql\+asyncpg:/, 'postgresql:'));
    return ['postgresql:', 'postgres:'].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function isMongoUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ['mongodb:', 'mongodb+srv:'].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function isRedisUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ['redis:', 'rediss:'].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function isPlaceholderSecret(value: string | undefined): boolean {
  // Used only by production policy checks; the actual secret is never logged.
  if (!value) return true;
  return [
    'replace-me',
    'replace-me-with-a-long-auth-pepper',
    'changeme',
    'change-me',
    'password',
  ].includes(value.toLowerCase());
}
