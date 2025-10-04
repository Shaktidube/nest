import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(4001, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  // Handle new client connections
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // Emit connection success message
    client.emit('connection_success', {
      message: 'Connected to NestJS WebSocket server!',
      clientId: client.id,
    });
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Optional: Add custom methods for your application
  // sendMessageToClient(clientId: string, message: any) {
  //   this.server.to(clientId).emit('message', message);
  // }

  // Broadcast to all connected clients
  broadcastMessage(event: string, message: any) {
    this.server.emit(event, message);
  }
}
