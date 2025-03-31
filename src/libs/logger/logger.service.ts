/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Logger as NestLogger } from '@nestjs/common';
import { SlackService } from 'nestjs-slack';

export type ILoggerOptions = {
  slack?: SlackService;
  debug?: boolean;
  environment?: string;
  project?: string;
};

let options: ILoggerOptions;

export class Logger extends NestLogger {
  constructor(context: string) {
    super(context);
  }

  static init(_options: ILoggerOptions): void {
    options = {
      ...options,
      ..._options,
    };
  }

  override debug(message: any, ...optionalParams: [...any, string?]): void;
  override debug(message: any, context?: string): void {
    if (options?.debug) {
      if (context) {
        super.debug(message, context);
      }

      super.debug(message);
    }
  }

  override error(message: any, ...optionalParams: [...any, string?, string?]): void;
  override error(message: any, trace?: string): void {
    super.error(message, trace);

    if (options?.environment === 'Production') {
      if (options?.slack) {
        void options.slack.postMessage({
          mrkdwn: true,
          channel: '#errors',
          text: `[${options.environment || 'unknown env'}] ${options.project || 'unknown project'}\n\`\`\`${
            typeof message === 'string' ? message : JSON.stringify(message)
          }\`\`\``,
        });
      }
    }
  }
}
