import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Logger } from '@libs/logger';

@Injectable()
export class HttpLogInterceptor implements NestInterceptor {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger(HttpLogInterceptor.name);
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    this.logger.log(`Request: ${request.method} ${request.originalUrl}`);

    return next.handle().pipe(
      tap((body) => {
        const response = context.switchToHttp().getResponse<Response>();
        this.logger.debug(`Response: ${response.statusCode}, ${JSON.stringify(body)}`);
      }),
      catchError((error: Error) => {
        const response = context.switchToHttp().getResponse<Response>();
        const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        response.statusCode = status;

        if (status < 500) {
          this.logger.warn(
            `Response: ${response.statusCode}, ` +
              `${typeof error?.['response'] === 'object' ? JSON.stringify(error['response']) : (error['response'] as string)}`,
          );
        }

        return throwError(() => error);
      }),
    );
  }
}
