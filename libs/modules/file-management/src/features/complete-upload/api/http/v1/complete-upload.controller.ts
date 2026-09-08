import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompleteUploadHandler } from '../../../application/complete-upload.handler';
import { CompleteUploadRequestDto } from './dto/complete-upload.request.dto';

@ApiTags('file-management')
@Controller({ path: 'file-management/complete-upload', version: '1' })
export class CompleteUploadController {
  constructor(private readonly handler: CompleteUploadHandler) {}

  @Post()
  execute(@Body() request: CompleteUploadRequestDto) {
    return this.handler.execute(request);
  }
}
