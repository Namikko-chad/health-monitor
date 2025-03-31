/* eslint-disable @typescript-eslint/no-empty-function */
import { NodeFetchRequest } from './node-fetch.interfaces';
import { NodeFetchService } from './node-fetch.service';

export const NodeFetchServiceMock = {
  provide: NodeFetchService,
  useValue: {
    async request<Res>(_: NodeFetchRequest): Promise<Res> {
      return Buffer.from('') as Res;
    },
    get requestInterval(): number {
      return 0;
    },
    get maxRequestPerSecond(): number {
      return 0;
    },
    get queueTotal(): number {
      return 0;
    },
  },
};
