import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { SlackModule } from 'nestjs-slack';

import { CacheModule } from '@libs/cache';

import { HealthMonitorModule } from './helath-monitor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    SlackModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get('SLACK_BOT_TOKEN'),
        defaultChannel: configService.get('SLACK_DEFAULT_CHANNEL'),
        type: 'api',
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    CacheModule,
    ScheduleModule.forRoot(),
    HealthMonitorModule,
  ],
})
export class AppModule {}
