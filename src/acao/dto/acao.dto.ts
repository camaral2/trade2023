import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AcaoDto {
  @ApiProperty({ description: 'The Name of Acao' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  readonly acao: string;

  @ApiProperty({ description: 'Value today' })
  @ApiProperty()
  @IsDecimal()
  readonly value: number;

  @ApiProperty({ description: 'Value today Max' })
  @ApiProperty()
  @IsDecimal()
  readonly valueMin: number;

  @ApiProperty({ description: 'Value today Min' })
  @ApiProperty()
  @IsDecimal()
  readonly valueMax: number;

  readonly dataAcao: Date;
}
