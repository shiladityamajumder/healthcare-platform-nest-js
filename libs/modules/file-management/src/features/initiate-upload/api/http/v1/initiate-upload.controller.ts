import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InitiateUploadHandler } from '../../../application/initiate-upload.handler';
import { InitiateUploadRequestDto } from './dto/initiate-upload.request.dto';

@ApiTags('file-management')
@Controller({ path: 'file-management/initiate-upload', version: '1' })
export class InitiateUploadController {
  constructor(private readonly handler: InitiateUploadHandler) {}

  @Post()
  execute(@Body() request: InitiateUploadRequestDto) {
    return this.handler.execute(request);
  }
}
