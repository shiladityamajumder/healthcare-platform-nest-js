// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/initiate-upload.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InitiateUploadHandler } from '../../../application/initiate-upload.handler';
import { InitiateUploadRequestDto } from './dto/initiate-upload.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('file-management')
@Controller({ path: 'file-management/initiate-upload', version: '1' })
export class InitiateUploadController {
  constructor(private readonly handler: InitiateUploadHandler) {}

  @Post()
  execute(@Body() request: InitiateUploadRequestDto) {
    return this.handler.execute(request);
  }
}
