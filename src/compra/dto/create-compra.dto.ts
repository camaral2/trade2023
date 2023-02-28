import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCompraDto {
  @ApiProperty({ description: 'The Name of Acao' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  readonly acao: string;

  @ApiProperty()
  @IsNumber()
  readonly valor: number;

  @ApiProperty()
  @IsInt()
  readonly qtd: number;

  @ApiProperty({ description: 'User of acao' })
  @IsNotEmpty()
  @IsString()
  readonly user: string;

  @ApiProperty()
  readonly data: Date;
}
