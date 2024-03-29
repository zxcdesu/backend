import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MessageService } from './message.service';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern('receiveMessage')
  received(@Payload() payload: any): Promise<void> {
    return this.messageService.received(payload.projectId, payload.message);
  }
}
