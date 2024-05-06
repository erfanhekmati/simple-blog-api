import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AuthService, PrismaService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
