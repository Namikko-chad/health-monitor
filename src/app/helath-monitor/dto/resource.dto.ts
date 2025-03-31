import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { IResource } from '../interfaces';

@Exclude()
export class ResourceDTO implements IResource {
  static create(this: void, input: unknown): ResourceDTO {
    return plainToInstance(ResourceDTO, input, { strategy: 'excludeAll' });
  }

  @Expose()
  @ApiProperty({ type: String, example: 'string' })
  name: string;

  @Expose()
  @ApiProperty({ type: String, example: 'ok' })
  status: string;

  @Expose()
  @ApiProperty({ type: String, example: 'Database offline' })
  details?: string;

  @Expose()
  @ApiProperty({ type: String, example: '2022-01-01T00:00:00.000Z' })
  timestamp: string;
}
