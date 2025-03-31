import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';

import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import { HealthMonitorController } from './health-monitor.controller';
import { HealthMonitorServiceMock } from './health-monitor.service.mock';

describe('HealthMonitor controller', () => {
  let moduleRef: TestingModule;
  let app: NestExpressApplication;
  let test: TestAgent;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [HealthMonitorController],
      providers: [HealthMonitorServiceMock],
    }).compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.init();
    test = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('work with controller', () => {
    it('/GET health-monitor', async () => {
      const res = await test.get('/health-monitor').send();

      expect(res.statusCode).toBe(200);
      expect(res.body[0]).toStrictEqual({
        status: expect.any(String),
        name: expect.any(String),
        timestamp: expect.any(String),
      });
    });
  });
});
