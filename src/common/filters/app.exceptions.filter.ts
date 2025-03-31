import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
  constructor(override readonly httpAdapterHost: HttpAdapterHost) {
    super();
  }

  override catch(exception: unknown, host: ArgumentsHost): void {
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const ctx = host.switchToHttp();
      const { httpAdapter } = this.httpAdapterHost;

      const responseBody = {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Unprocessable entity',
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, HttpStatus.UNPROCESSABLE_ENTITY);
    } else {
      super.catch(exception, host);
    }
  }
}
