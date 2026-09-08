import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GenerateDownloadUrlHandler } from '../../../application/generate-download-url.handler';
import { GenerateDownloadUrlRequestDto } from './dto/generate-download-url.request.dto';

@ApiTags('file-management')
@Controller({ path: 'file-management/generate-download-url', version: '1' })
export class GenerateDownloadUrlController {
  constructor(private readonly handler: GenerateDownloadUrlHandler) {}

  @Post()
  execute(@Body() request: GenerateDownloadUrlRequestDto) {
    return this.handler.execute(request);
  }
}
