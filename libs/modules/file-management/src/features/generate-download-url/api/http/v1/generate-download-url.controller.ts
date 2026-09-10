// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/generate-download-url.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GenerateDownloadUrlHandler } from '../../../application/generate-download-url.handler';
import { GenerateDownloadUrlRequestDto } from './dto/generate-download-url.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('file-management')
@Controller({ path: 'file-management/generate-download-url', version: '1' })
export class GenerateDownloadUrlController {
  constructor(private readonly handler: GenerateDownloadUrlHandler) {}

  @Post()
  execute(@Body() request: GenerateDownloadUrlRequestDto) {
    return this.handler.execute(request);
  }
}
