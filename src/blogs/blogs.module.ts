import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { EmailsModule } from 'src/emails/emails.module';

@Module({
  imports: [AuthModule],
  controllers: [BlogsController],
  providers: [BlogsService, PrismaService],
})
export class BlogsModule {}
