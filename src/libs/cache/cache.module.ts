import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';

import { CacheService } from './cache.service';
import { memoryConfig } from './configs';

@Global()
@Module({
  imports: [ConfigModule.forRoot(), NestCacheModule.registerAsync(memoryConfig)],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule implements OnModuleDestroy {
  @Inject(ModuleRef) private _moduleRef: ModuleRef;

  async onModuleDestroy(): Promise<void> {
    const client = this._moduleRef.get(CacheService);
    await client.close();
  }
}
