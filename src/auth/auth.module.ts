import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  providers: [AuthService, PrismaService, JwtService, AtStrategy, RtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
