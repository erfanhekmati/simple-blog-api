import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { EmailInterface } from './interfaces/email.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { CommentAddedEvent } from 'src/blogs/events';

@Injectable()
export class EmailsService {
  constructor(
    @InjectQueue('emailSending') private readonly emailQueue: Queue,
  ) {}

  @OnEvent('comment.added')
  private sendCommentAddedEmail(payload: CommentAddedEvent) {
    const emailData: EmailInterface = {
      from: 'support@blogapi.com',
      to: payload.authorEmail,
      subject: 'Comment on your blog',
      body: `A comment added to blog with id: ${payload.blogId}.`,
    };
    this.emailQueue.add('sendTransactionEmail', emailData);
  }
}
