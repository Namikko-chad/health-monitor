import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { Templates } from './mail.const';
import { EmailType } from './mail.enum';
import { IParamsEmailRequest } from './mail.interface';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(public mailerService: MailerService) {}

  async sendEmail<T extends EmailType>(type: T, receiver: string | string[], context: IParamsEmailRequest[T]): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: receiver,
        subject: Templates[type].subject,
        template: Templates[type].path,
        context,
      });
    } catch (e) {
      this.logger.error('Failed to send email', e);
    }
  }
}
