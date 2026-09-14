// * Provides database connectivity and transaction support for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { postgresOptions } from './postgres/postgres.options';
import { PostgresDatabase } from './postgres/postgres.database';
import { POSTGRES_POOL } from './postgres/postgres.tokens';
import { PostgresTransactionManager } from './transaction/postgres-transaction-manager';
import { TRANSACTION_MANAGER } from './transaction/transaction-manager';
import { MongoClient } from 'mongodb';
import { MONGO_CLIENT } from './mongo/mongo.tokens';
import { MongoDatabase } from './mongo/mongo.database';

const databaseEnabled = process.env.DATABASE_ENABLED !== 'false';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MONGO_CLIENT,
      inject: [ConfigService],
      // * Creates the optional MongoDB client after validating the required Mongo settings.
      useFactory: (config: ConfigService): MongoClient | null => {
        if (!isEnabled(config.get<string>('MONGO_ENABLED'))) return null;

        const uri = config.get<string>('MONGO_URI');
        if (!uri) throw new Error('MONGO_URI is required when MONGO_ENABLED=true.');
        if (!config.get<string>('MONGO_DATABASE')) {
          throw new Error('MONGO_DATABASE is required when MONGO_ENABLED=true.');
        }

        return new MongoClient(uri, {
          appName: 'healthcare-platform',
          serverSelectionTimeoutMS: Number(
            config.get<string>('MONGO_SERVER_SELECTION_TIMEOUT_MS') ?? 5_000,
          ),
        });
      },
    },
    MongoDatabase,
    ...(databaseEnabled
      ? [
          {
            provide: POSTGRES_POOL,
            inject: [ConfigService],
            // * Creates the PostgreSQL connection pool from the centralized platform configuration.
            useFactory: (config: ConfigService) => new Pool(postgresOptions(config)),
          },
          PostgresDatabase,
          PostgresTransactionManager,
          {
            provide: TRANSACTION_MANAGER,
            useExisting: PostgresTransactionManager,
          },
        ]
      : []),
  ],
  exports: [
    ...(databaseEnabled
      ? [POSTGRES_POOL, PostgresDatabase, PostgresTransactionManager, TRANSACTION_MANAGER]
      : []),
    MongoDatabase,
    MONGO_CLIENT,
  ],
})
export class DatabaseModule {}

// * Interprets the supported environment representations for an optional platform dependency.
function isEnabled(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}
