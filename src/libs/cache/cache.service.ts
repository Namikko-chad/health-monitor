import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { ICache } from './cache.interface';

@Injectable()
export class CacheService implements ICache {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  public async set(key: string, value: unknown, seconds?: number): Promise<void> {
    // eslint-disable-next-line no-param-reassign
    value = JSON.stringify(value);

    if (!seconds) {
      await this.cache.set(key, value);
    } else {
      await this.cache.set(key, value, seconds);
    }
  }

  public async get<R>(key: string): Promise<R | null> {
    const data = await this.cache.get(key);

    if (typeof data === 'string') {
      return JSON.parse(data) as R;
    } else {
      return null;
    }
  }

  public async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  public async flushAll(): Promise<void> {
    await this.cache.clear();
  }

  async close(): Promise<void> {
    await this.cache.disconnect();
  }
}
