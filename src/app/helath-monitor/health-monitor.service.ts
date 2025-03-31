import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';

import { CacheService } from '@libs/cache';
import { Logger } from '@libs/logger';
import { HttpMethod, NodeFetchService } from '@libs/node-fetch';

import { IHealthMonitorResponse, IResource } from './interfaces';

@Injectable()
export class HealthMonitorService implements OnApplicationBootstrap {
  private readonly logger = new Logger(HealthMonitorService.name);
  private readonly resources: string[];

  constructor(
    private readonly cache: CacheService,
    private readonly config: ConfigService,
    private readonly fetch: NodeFetchService,
  ) {
    this.resources = this.config.getOrThrow<string>('RESOURCES').split(',');
    this.logger.verbose(`Resources: ${this.resources}`);
  }

  onApplicationBootstrap(): void {
    void this.check();
  }

  @Interval(60000)
  async check(): Promise<void> {
    this.logger.debug(`Health check of ${this.resources.length} resources`);
    const res = await Promise.all(
      this.resources.map(async (resource): Promise<IResource> => {
        try {
          const data = await this.fetch.rawRequest({
            method: HttpMethod.GET,
            endpoint: new URL(`https://${resource}/api/health-check`),
          });

          if (data.status !== 200) {
            const res = await this.fetch.request<
              {
                module: string;
                status: string;
                details?: string;
              }[]
            >({
              method: HttpMethod.GET,
              endpoint: new URL(`https://${resource}/api/health-check/detailed`),
            });

            return {
              name: resource,
              status: 'error',
              details: res.map((res) => `${res.module}: ${res?.details}`).join(', '),
              timestamp: new Date().toISOString(),
            };
          }

          return {
            name: resource,
            status: 'ok',
            timestamp: new Date().toISOString(),
          };
        } catch (error) {
          return {
            name: resource,
            status: 'error',
            details: JSON.stringify(error),
            timestamp: new Date().toISOString(),
          };
        }
      }),
    );

    res
      .filter((resource) => resource.status === 'error')
      .forEach((resource) => {
        this.logger.error(`Resource ${resource.name} is not healthy`);
      });

    await this.cache.set('resource', res);
  }

  async list(): Promise<IHealthMonitorResponse> {
    return this.cache.get<IHealthMonitorResponse>('resource');
  }
}
