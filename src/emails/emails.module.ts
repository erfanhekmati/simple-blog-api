import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsProcessor } from './emails.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emailSending',
    }),
  ],
  providers: [EmailsService, EmailsProcessor],
  exports: [EmailsService],
})
export class EmailsModule {}
