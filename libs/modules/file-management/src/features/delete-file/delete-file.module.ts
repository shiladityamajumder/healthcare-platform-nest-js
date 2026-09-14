// * Linked with: @nestjs/common, ./delete-file.controller, ./delete-file.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { DeleteFileController } from './delete-file.controller';
import { DeleteFileHandler } from './delete-file.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [DeleteFileController],
  providers: [DeleteFileHandler],
})
export class DeleteFileModule {}
