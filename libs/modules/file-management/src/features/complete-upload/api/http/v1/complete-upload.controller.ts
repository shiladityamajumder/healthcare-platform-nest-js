// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/complete-upload.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompleteUploadHandler } from '../../../application/complete-upload.handler';
import { CompleteUploadRequestDto } from './dto/complete-upload.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('file-management')
@Controller({ path: 'file-management/complete-upload', version: '1' })
export class CompleteUploadController {
  constructor(private readonly handler: CompleteUploadHandler) {}

  @Post()
  execute(@Body() request: CompleteUploadRequestDto) {
    return this.handler.execute(request);
  }
}
