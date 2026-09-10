// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/get-file.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetFileHandler } from '../../../application/get-file.handler';
import { GetFileRequestDto } from './dto/get-file.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('file-management')
@Controller({ path: 'file-management/get-file', version: '1' })
export class GetFileController {
  constructor(private readonly handler: GetFileHandler) {}

  @Post()
  execute(@Body() request: GetFileRequestDto) {
    return this.handler.execute(request);
  }
}
