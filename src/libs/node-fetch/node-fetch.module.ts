import { DynamicModule, Module } from '@nestjs/common';

import { INodeFetchOptions } from './node-fetch.interfaces';
import { NodeFetchService } from './node-fetch.service';

@Module({})
export class NodeFetchModule {
  static register(options: INodeFetchOptions): DynamicModule {
    return {
      module: NodeFetchModule,
      providers: [
        {
          provide: 'THROTTLE_OPTIONS',
          useValue: options,
        },
        NodeFetchService,
      ],
      exports: [NodeFetchService],
    };
  }
}
