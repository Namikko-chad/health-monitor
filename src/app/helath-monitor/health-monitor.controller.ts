import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ResourceDTO } from './dto';
import { HealthMonitorService } from './health-monitor.service';
import { render } from './health-monitor.utils';

@Controller('health-monitor')
@ApiTags('Health monitor')
export class HealthMonitorController {
  constructor(private readonly service: HealthMonitorService) {}

  @Get()
  @ApiOperation({ summary: 'List all resources' })
  @ApiHeaders([{ name: 'accept', required: true, description: 'Accept header', enum: ['text/html', 'application/json'] }])
  @ApiOkResponse({ type: ResourceDTO, isArray: true })
  async list(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ResourceDTO[] | void> {
    const resources = await this.service.list();
    const accept = req.headers['accept'];

    if (accept === 'text/html') {
      res.setHeader('Content-Type', 'text/html');
      res.send(render(resources));

      return;
    }

    return resources.map((resource) => ResourceDTO.create(resource));
  }
}
