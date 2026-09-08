import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttachDocumentHandler } from '../../../application/attach-document.handler';
import { AttachDocumentRequestDto } from './dto/attach-document.request.dto';

@ApiTags('prescriptions')
@Controller({ path: 'prescriptions/attach-document', version: '1' })
export class AttachDocumentController {
  constructor(private readonly handler: AttachDocumentHandler) {}

  @Post()
  execute(@Body() request: AttachDocumentRequestDto) {
    return this.handler.execute(request);
  }
}
