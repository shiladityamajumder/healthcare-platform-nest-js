import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { postgresOptions } from './postgres/postgres.options';
import { TypeOrmTransactionManager } from './transaction/typeorm-transaction-manager';
import { TRANSACTION_MANAGER } from './transaction/transaction-manager';
import { MongoClient } from 'mongodb';
import { MONGO_CLIENT } from './mongo/mongo.tokens';
import { MongoDatabase } from './mongo/mongo.database';

const databaseEnabled = process.env.DATABASE_ENABLED !== 'false';

@Module({
  imports: [
    ConfigModule,
    ...(databaseEnabled
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: postgresOptions,
          }),
        ]
      : []),
  ],
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
            provide: TRANSACTION_MANAGER,
            inject: [DataSource],
            useFactory: (dataSource: DataSource) => new TypeOrmTransactionManager(dataSource),
          },
        ]
      : []),
  ],
  exports: [...(databaseEnabled ? [TRANSACTION_MANAGER] : []), MongoDatabase, MONGO_CLIENT],
})
export class DatabaseModule {}

function isEnabled(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}
