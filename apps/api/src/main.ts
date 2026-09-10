// Linked with: @nestjs/core, @nestjs/platform-fastify, ./app.module.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { configureApplication } from './bootstrap/configure-application';

async function bootstrap(): Promise<void> {
  // Define the shared types or behavior used by the surrounding package.
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    { bufferLogs: true },
  );

  configureApplication(app);
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
