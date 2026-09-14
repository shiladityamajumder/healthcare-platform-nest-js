// * Boots the API with buffered structured logging and the platform application configuration.
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppLogger } from '@platform/logging';
import { AppModule } from './app.module';
import { configureApplication } from './bootstrap/configure-application';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    {
      bufferLogs: true,
      logger: ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'],
    },
  );

  app.useLogger(app.get(AppLogger));
  configureApplication(app);
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
