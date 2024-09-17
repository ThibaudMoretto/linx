import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: any) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
    this.logger.debug(`Number of rooms: ${this.io.sockets.adapter.rooms.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);

    this.removeEmptyRooms();
  }

  @SubscribeMessage('messageToRoom')
  handleMessageToRoom(client: Socket, payload: { room: string; message: string }) {
    this.io.to(payload.room).emit('messageResponse', payload.message);
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    client: Socket,
    payload: { targetSocketId: string; message: string },
  ) {
    const targetSocket = this.io.sockets.sockets.get(payload.targetSocketId);
    if (targetSocket) {
      targetSocket.emit('messageResponse', payload.message);
    }
  }

  private getSharedRooms(): string[] {
    return Array.from(this.io.sockets.adapter.rooms.keys()).filter(room =>
      room.startsWith('room_'),
    );
  }

  @SubscribeMessage('getRooms')
  handleGetRooms(client: Socket) {
    client.emit('roomsList', this.getSharedRooms());
  }

  private removeEmptyRooms() {
    const rooms = this.io.sockets.adapter.rooms;
    rooms.forEach((_, room) => {
      if (
        room.startsWith('room_') &&
        this.io.sockets.adapter.rooms.get(room)?.size === 0
      ) {
        rooms.delete(room);
        this.logger.log(`Room ${room} deleted because it was empty`);
      }
    });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join('room_' + room);
    this.logger.log(`Client id: ${client.id} joined room ${room}`);

    // if the room is created, then send the list of rooms to all clients
    if (!this.io.sockets.adapter.rooms.has(room)) {
      this.io.emit('roomsList', this.getSharedRooms());
    }
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(client: Socket, room: string) {
    // creates the room with a uuidv4 id and joins it
    client.join('room_' + room);
    this.logger.log(`Client id: ${client.id} created room ${room}`);
    this.io.emit('roomsList', this.getSharedRooms());
  }
}
