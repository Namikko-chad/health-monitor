import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { beforeEach, describe, expect, it } from '@jest/globals';

import { EmailType } from './mail.enum';
import { MailModule } from './mail.module';
import { MailService } from './mail.service';

describe('Mail service', () => {
  // let config: ConfigService;
  let service: MailService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), MailModule],
    }).compile();

    // config = moduleRef.get<ConfigService>(ConfigService);
    service = moduleRef.get<MailService>(MailService);
  });

  describe('work with service', () => {
    it('Send default email', async () => {
      await expect(
        service.mailerService.sendMail({
          to: 'bloodheavendevelop@gmail.com',
          subject: 'Test email',
          html: 'From jest with love',
        }),
      ).resolves.not.toThrowError();
    });

    it('Send confirmation email', async () => {
      await expect(service.sendEmail(EmailType.Confirmation, 'bloodheavendevelop@gmail.com', { code: '1234' })).resolves.not.toThrowError();
      // const res = await service.sendEmail(EmailType.Confirmation, config.getOrThrow<string>('MAIL_FROM'), {code: '1234'});
    });
  });
});
