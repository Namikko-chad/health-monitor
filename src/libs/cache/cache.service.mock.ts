/* eslint-disable @typescript-eslint/no-empty-function */
import { CacheService } from './cache.service';

export const CacheServiceMock = {
  provide: CacheService,
  useValue: {
    async set(_key: string, _value: unknown, _seconds?: number): Promise<void> {},
    async get<R>(_key: string): Promise<R | null> {
      return null;
    },
    async del(_key: string): Promise<void> {},
    async flushAll(): Promise<void> {},
    async close(): Promise<void> {},
  },
};
