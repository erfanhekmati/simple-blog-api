import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, PrismaService],
})
export class BlogsModule {}
