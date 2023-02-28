import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ReturnDeleteUpdateDto {
  @ApiProperty({ description: 'Number of record update ou delete' })
  @IsInt()
  readonly affected: number;
}
