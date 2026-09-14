// * Linked with: @nestjs/common, @nestjs/platform-fastify, @nestjs/swagger.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { ValidationPipe, VersioningType } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BaseModule } from '../base/base.module';
import { HealthModule } from '../health/health.module';
import { AuthModule } from '@modules/auth';

// * Define the shared types or behavior used by the surrounding package.
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
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token returned by login, registration, or token refresh.',
        },
        'bearer',
      )
      .addTag('system', 'Service metadata and health checks.')
      .addTag(
        'auth',
        'Registration, authentication, sessions, current-user data, and authorization administration.',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      include: [BaseModule, HealthModule, AuthModule],
      deepScanRoutes: true,
    });
    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: true,
      jsonDocumentUrl: 'docs/openapi.json',
      yamlDocumentUrl: 'docs/openapi.yaml',
    });
  }
}
