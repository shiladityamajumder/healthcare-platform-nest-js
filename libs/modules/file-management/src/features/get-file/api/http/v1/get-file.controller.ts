import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetFileHandler } from '../../../application/get-file.handler';
import { GetFileRequestDto } from './dto/get-file.request.dto';

@ApiTags('file-management')
@Controller({ path: 'file-management/get-file', version: '1' })
export class GetFileController {
  constructor(private readonly handler: GetFileHandler) {}

  @Post()
  execute(@Body() request: GetFileRequestDto) {
    return this.handler.execute(request);
  }
}
