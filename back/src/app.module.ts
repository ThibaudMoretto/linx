import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, ChatGateway, AuthService, UsersService, JwtService],
})
export class AppModule {}
