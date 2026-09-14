// * Provides database connectivity and transaction support for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';
import { MONGO_CLIENT } from './mongo.tokens';

@Injectable()
export class MongoDatabase implements OnModuleInit, OnModuleDestroy {
  private database: Db | undefined;

  // * Receives the optional Mongo client and configuration needed during initialization.
  public constructor(
    @Inject(MONGO_CLIENT) private readonly client: MongoClient | null,
    private readonly config: ConfigService,
  ) {}

  // * Connects the optional MongoDB client and selects the configured database during startup.
  public async onModuleInit(): Promise<void> {
    if (!this.client) return;

    await this.client.connect();
    this.database = this.client.db(this.config.getOrThrow<string>('MONGO_DATABASE'));
  }

  // * Closes the MongoDB client during graceful application shutdown.
  public async onModuleDestroy(): Promise<void> {
    await this.client?.close();
  }

  // * Returns the initialized database handle or explains why MongoDB is unavailable.
  public get db(): Db {
    if (!this.database) {
      throw new Error('MongoDB is disabled or has not been initialized.');
    }
    return this.database;
  }

  // * Reports whether the application was configured with a MongoDB client.
  public get isEnabled(): boolean {
    return this.client !== null;
  }

  // * Performs a lightweight health check against the selected MongoDB database.
  public async ping(): Promise<void> {
    await this.db.command({ ping: 1 });
  }
}
