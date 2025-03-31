import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { isEnum } from 'class-validator';
import helmet from 'helmet';
import { SlackService } from 'nestjs-slack';

import { AppModule } from '@app/app.module';
import { NODE_ENV } from '@common/enum';
import { ExceptionsFilter } from '@common/filters';
import { ErrorsInterceptor, HttpLogInterceptor } from '@common/interceptors';
import { initSwagger } from '@common/swagger';
import { Logger } from '@libs/logger';

import 'reflect-metadata';

async function init(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const environment = config.getOrThrow<NODE_ENV>('NODE_ENV');

  if (!isEnum(environment, ['Development', 'Production', 'Staging'])) {
    throw new Error('Invalid NODE_ENV');
  }

  Logger.init({
    environment,
    debug: config.get<boolean>('DEBUG') ?? false,
    project: 'NestJS Template',
    slack: app.get(SlackService),
  });

  app.enableShutdownHooks();

  app.setGlobalPrefix(config.get<string>('ROUTE_PREFIX') ?? 'api');

  app.useGlobalFilters(new ExceptionsFilter(app.get(HttpAdapterHost)));

  app.useGlobalInterceptors(new HttpLogInterceptor(), new ErrorsInterceptor());

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: 'Content-Type, Accept',
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", 'http://localhost:3060'],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    }),
  );

  initSwagger({
    app,
    config,
  });

  await app.startAllMicroservices();
  await app.listen(config.get<number>('SERVER_PORT') ?? 3060);
}

init().catch((error) => console.error(error));
