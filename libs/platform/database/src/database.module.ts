// * Linked with: @nestjs/common, @nestjs/config, pg.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
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

// * Register the feature components and their dependencies with NestJS.
const databaseEnabled = process.env.DATABASE_ENABLED !== 'false';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MONGO_CLIENT,
      inject: [ConfigService],
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

function isEnabled(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}
