import { EmailType } from './mail.enum';
import { ITemplates } from './mail.interface';

export const Templates: ITemplates = {
  [EmailType.EmailConfirmation]: {
    subject: 'Email Confirmation for RWA Scan',
    path: 'emailConfirmation',
  },
  [EmailType.PasswordRecovery]: {
    subject: 'Password recovery on RWA Scan',
    path: 'passwordRecovery',
  },
  [EmailType.Confirmation]: {
    subject: 'Confirmation code',
    path: 'confirmation',
  },
};
