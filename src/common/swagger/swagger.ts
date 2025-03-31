/* eslint-disable */
import { NODE_ENV } from '@common/enum';
import { INestApplication, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule, } from '@nestjs/swagger';
import { Request, Response, } from 'express';

interface SwaggerInit {
  readonly app: INestApplication;
  readonly config: ConfigService;
  readonly logger?: Logger;
  readonly environment?: NODE_ENV;
}

export function initSwagger(init: SwaggerInit) {
  const { app, config, environment = NODE_ENV.Development, } = init;

  if (environment === NODE_ENV.Production) {
    return;
  }

  const { name, version, } = require('../../../package.json');
  const routePrefix = config.get<string>('ROUTE_PREFIX') ?? 'api';
  const swaggerPrefix = config.get<string>('SWAGGER_PREFIX') ?? 'swagger';
  const swaggerDocUrl = `/${routePrefix}/${swaggerPrefix}.json`;
  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setExternalDoc('Swagger Document', swaggerDocUrl)
    .setVersion(version)
    .addServer(config.get<string>('DOMAIN_NAME'))
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup(`${routePrefix}/${swaggerPrefix}`, app, document);
  app.getHttpAdapter().get(swaggerDocUrl, (_: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });
}
