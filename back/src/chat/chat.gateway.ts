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
    origin: ['http://localhost:5173', 'http://localhost:5174'],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  private readonly inactivityTimeout = 10000; // 10 secondes
  private activeConnections: Map<string, { lastActivity: number }> = new Map();
  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
    setInterval(() => {
      this.terminateInactiveConnections();
    }, 1000000); // Exécute toutes les 1000 secondes
  }

  handleConnection(client: any) {
    const { sockets } = this.io.sockets;
    this.activeConnections.set(client.id, { lastActivity: Date.now() });
    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
    this.logger.debug(`Number of rooms: ${this.io.sockets.adapter.rooms.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
    this.activeConnections.delete(client.id);
    this.removeEmptyRooms();
  }

  @SubscribeMessage('messageToRoom')
  handleMessageToRoom(
    client: Socket,
    payload: { room: string; message: string; author: string },
  ) {
    console.log('messageToRoom', payload);

    this.io
      .to(payload.room)
      .emit('messageResponse', { label: payload.message, author: payload.author });
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
    if (this.io.sockets.adapter.rooms.has(room)) {
      client.join(room);
      this.io.to(room).emit('userJoined', { clientId: client.id, room: room });
    } else {
      const roomName = 'room_' + room;
      client.join(roomName);
      this.io.emit('roomsList', this.getSharedRooms());
      this.logger.log(`Client id: ${client.id} joined room ${roomName}`);
      this.io.to(roomName).emit('userJoined', { clientId: client.id, room: roomName });
    }
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(client: Socket, room: string) {
    // creates the room with a uuidv4 id and joins it
    client.join('room_' + room);
    this.logger.log(`Client id: ${client.id} created room ${room}`);
    this.io.emit('roomsList', this.getSharedRooms());
  }

  // get the number of connected users in a room
  @SubscribeMessage('getNumberOfUsersInRoom')
  handleGetNumberOfUsersInRoom(client: Socket, room: string) {
    const roomName = 'room_' + room;
    // only user which are not a room
    const numberOfUsers = this.io.sockets.adapter.rooms.get(roomName)?.size;
    console.log('numberOfUsersInRoom', numberOfUsers);
    client.emit('numberOfUsersInRoom', numberOfUsers);
  }

  // get the number of connected users
  @SubscribeMessage('getNumberOfUsers')
  handleGetNumberOfUsers(client: Socket) {
    const numberOfUsers = this.io.sockets.sockets.size;
    // log their ids
    console.log('numberOfUsers', this.io.sockets.sockets.keys());

    client.emit('numberOfUsers', numberOfUsers);
  }

  @SubscribeMessage('terminateInactiveConnections')
  handleTerminateInactiveConnections() {
    this.terminateInactiveConnections();
  }

  private terminateInactiveConnections() {
    const now = Date.now();
    let terminatedCount = 0;

    for (const [clientId, data] of this.activeConnections.entries()) {
      if (now - data.lastActivity > this.inactivityTimeout) {
        const socket = this.io.sockets.sockets.get(clientId);
        if (socket) {
          this.logger.log(`Terminating inactive connection: ${clientId}`);
          socket.disconnect(true);
          this.activeConnections.delete(clientId);
          terminatedCount++;
        }
      }
    }

    this.logger.log(`Terminated ${terminatedCount} inactive connections`);
    this.sendActiveUsersCount();
  }

  private sendActiveUsersCount() {
    const count = this.activeConnections.size;
    this.logger.log(`Active users: ${count}`);
    this.io.emit('numberOfUsers', count);
  }
}
