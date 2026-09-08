import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteFileHandler } from '../../../application/delete-file.handler';
import { DeleteFileRequestDto } from './dto/delete-file.request.dto';

@ApiTags('file-management')
@Controller({ path: 'file-management/delete-file', version: '1' })
export class DeleteFileController {
  constructor(private readonly handler: DeleteFileHandler) {}

  @Post()
  execute(@Body() request: DeleteFileRequestDto) {
    return this.handler.execute(request);
  }
}
