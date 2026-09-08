import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';
import { MONGO_CLIENT } from './mongo.tokens';

@Injectable()
export class MongoDatabase implements OnModuleInit, OnModuleDestroy {
  private database: Db | undefined;

  public constructor(
    @Inject(MONGO_CLIENT) private readonly client: MongoClient | null,
    private readonly config: ConfigService,
  ) {}

  public async onModuleInit(): Promise<void> {
    if (!this.client) return;

    await this.client.connect();
    this.database = this.client.db(this.config.getOrThrow<string>('MONGO_DATABASE'));
  }

  public async onModuleDestroy(): Promise<void> {
    await this.client?.close();
  }

  public get db(): Db {
    if (!this.database) {
      throw new Error('MongoDB is disabled or has not been initialized.');
    }
    return this.database;
  }

  public get isEnabled(): boolean {
    return this.client !== null;
  }

  public async ping(): Promise<void> {
    await this.db.command({ ping: 1 });
  }
}
