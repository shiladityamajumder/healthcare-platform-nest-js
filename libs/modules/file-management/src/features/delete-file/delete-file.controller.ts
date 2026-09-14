// * Linked with: @nestjs/common, @nestjs/swagger, ./delete-file.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteFileHandler } from './delete-file.handler';
import { DeleteFileRequestDto } from './delete-file.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('file-management')
@Controller({ path: 'file-management/delete-file', version: '1' })
export class DeleteFileController {
  constructor(private readonly handler: DeleteFileHandler) {}

  @Post()
  execute(@Body() request: DeleteFileRequestDto) {
    return this.handler.execute(request);
  }
}
