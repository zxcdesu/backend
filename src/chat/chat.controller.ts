import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern('receiveChat')
  received(@Payload() payload: any): Promise<void> {
    return this.chatService.received(payload.projectId, payload.chat);
  }
}
