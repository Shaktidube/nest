import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  private messages: { userId: string; message: string }[] = [];

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);

    client.broadcast.emit('user-joined', {
      messsage: `new user joined the chat ${client.id}`,
    });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);

    this.server.emit('user-left', {
      messsage: `new user left the chat ${client.id}`,
    });
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(client: Socket, payload: string) {
    console.log('New message received:', payload);
    client.broadcast.emit('message', payload);
  }

  // @SubscribeMessage('joinRoom')
  // handleJoinRoom(client: Socket, room: string) {
  //   client.join(room);
  //   console.log(`${client.id} joined room: ${room}`);
  //   this.server.to(room).emit('roomNotice', `${client.id} joined`);
  // }

  // @SubscribeMessage('chatMessage')
  // handleChatMessage(
  //   client: Socket,
  //   payload: { userId: string; message: string },
  // ) {
  //   // const saved = await this.chatService.sendMessage(payload.userId, payload.message);
  //   const newMessage = { userId: payload.userId, message: payload.message };
  //   // Here you can also save to MongoDB if needed
  //   this.messages.push(newMessage);
  //   // Broadcast to all in "grp"
  //   this.server.to('grp').emit('newMessage', newMessage);
  // }
}
