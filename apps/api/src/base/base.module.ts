// * Linked with: @nestjs/common, ./base.controller.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { BaseController } from './base.controller';

// * Register the feature components and their dependencies with NestJS.
@Module({ controllers: [BaseController] })
export class BaseModule {}
