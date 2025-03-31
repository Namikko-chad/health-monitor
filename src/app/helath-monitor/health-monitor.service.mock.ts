import { HealthMonitorService } from './health-monitor.service';
import { IHealthMonitorResponse } from './interfaces';

export const HealthMonitorServiceMock = {
  provide: HealthMonitorService,
  useValue: {
    list(): IHealthMonitorResponse {
      return [
        {
          name: 'test',
          status: 'ok',
          timestamp: new Date().toISOString(),
        },
      ];
    },
  },
};
