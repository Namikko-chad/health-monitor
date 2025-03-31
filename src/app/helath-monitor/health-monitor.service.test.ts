import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach } from 'node:test';

import { beforeEach, describe, expect, it } from '@jest/globals';

import { CacheServiceMock } from '@libs/cache';
import { NodeFetchServiceMock } from '@libs/node-fetch';

import { HealthMonitorService } from './health-monitor.service';

describe('HealthMonitor service', () => {
  let moduleRef: TestingModule;
  let service: HealthMonitorService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [HealthMonitorService, NodeFetchServiceMock, CacheServiceMock],
    }).compile();

    service = moduleRef.get<HealthMonitorService>(HealthMonitorService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('work with service', () => {
    it('should receive HealthMonitor', async () => {
      const res = await service.list();

      expect(res).toStrictEqual(null);
    });
  });
});
