import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NodeFetchModule } from '@libs/node-fetch';

import { HealthMonitorController } from './health-monitor.controller';
import { HealthMonitorService } from './health-monitor.service';

@Module({
  imports: [
    ConfigModule,
    NodeFetchModule.register({
      instanceName: 'HealthMonitor',
      maxRequestPerSecond: 10,
    }),
  ],
  controllers: [HealthMonitorController],
  providers: [HealthMonitorService],
})
export class HealthMonitorModule {}
