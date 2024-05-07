import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailInterface } from './interfaces/email.interface';

@Processor('emailSending')
export class EmailsProcessor {
  @Process('sendTransactionEmail')
  sendTransactionEmail(job: Job<EmailInterface>) {
    const { body, from, to, subject } = job.data;
    console.log(
      `\n\nEmail sent from ${from} to ${to}\nEmail Subject: ${subject}\nEmail Body: ${body}\n\n`,
    );
  }
}
