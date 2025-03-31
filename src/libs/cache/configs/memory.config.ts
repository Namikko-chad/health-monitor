import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { memoryStore } from 'cache-manager-memory-store';

export const memoryConfig: CacheModuleAsyncOptions = {
  useFactory: async () => {
    return {
      store: memoryStore,
    };
  },
};
