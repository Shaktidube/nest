import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private messages: { userId: string; message: string }[] = [];

  sendMessage(userId: string, message: string) {
    const newMessage = { userId, message };
    // Here you can also save to MongoDB if needed
    this.messages.push(newMessage);

    return newMessage;
  }

  getMessages() {
    return this.messages;
  }
}
