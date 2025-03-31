import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

import { Logger } from '@libs/logger';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(ErrorsInterceptor.name);
  }

  intercept(_: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      catchError((error: Error) => {
        if (error instanceof HttpException) {
          const status = error.getStatus();

          if (status >= 500) {
            this.logError(error);
          }
        } else {
          this.logError(error);
        }

        return throwError(() => error);
      }),
    );
  }

  private logError(error: Error): void {
    this.logger.error(
      JSON.stringify({
        message: error.message,
        exception: error.name,
        stack: error.stack,
      }),
    );
  }
}
