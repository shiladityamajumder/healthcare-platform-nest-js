import { ValidationPipe, VersioningType } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BaseModule } from '../base/base.module';
import { HealthModule } from '../health/health.module';

export function configureApplication(app: NestFastifyApplication): void {
  const apiPrefix = process.env.API_PREFIX ?? 'api';

  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: process.env.API_VERSION ?? '1',
  });
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  if ((process.env.DOCS_ENABLED ?? 'true') === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Healthcare Platform API')
      .setDescription('Modular monolith HTTP API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      include: [BaseModule, HealthModule],
    });
    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: true,
      jsonDocumentUrl: 'docs/openapi.json',
      yamlDocumentUrl: 'docs/openapi.yaml',
    });
  }
}
