import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { EmailInterface } from './interfaces/email.interface';

@Injectable()
export class EmailsService {
  constructor(
    @InjectQueue('emailSending') private readonly emailQueue: Queue,
  ) {}

  public sendCommentAddedEmail(email: string, blogId: number) {
    const emailData: EmailInterface = {
      from: 'support@blogapi.com',
      to: email,
      subject: 'Comment on your blog',
      body: `A comment added to blog with id: ${blogId}.`,
    };
    this.emailQueue.add('sendTransactionEmail', emailData);
  }
}
