// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/attach-document.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttachDocumentHandler } from '../../../application/attach-document.handler';
import { AttachDocumentRequestDto } from './dto/attach-document.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('prescriptions')
@Controller({ path: 'prescriptions/attach-document', version: '1' })
export class AttachDocumentController {
  constructor(private readonly handler: AttachDocumentHandler) {}

  @Post()
  execute(@Body() request: AttachDocumentRequestDto) {
    return this.handler.execute(request);
  }
}
