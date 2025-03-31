import { EmailType } from './mail.enum';

export interface IParamsEmailRequest {
  readonly [EmailType.Confirmation]: IEmailWithCodeConfirmation;
  readonly [EmailType.EmailConfirmation]: IEmailWithCodeConfirmation;
  readonly [EmailType.PasswordRecovery]: IEmailWithCodeConfirmation;
}

export type ITemplates = {
  [key in EmailType]: {
    subject: string;
    path: string;
  };
};

export interface IEmailWithCodeConfirmation {
  readonly code: string;
}

export interface IEmailStub {
  subject: string;
  body: string;
}
