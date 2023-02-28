import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCompraDto } from './create-compra.dto';
import { IsDate, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCompraDto extends PartialType(CreateCompraDto) {
  @ApiProperty()
  @IsNumber()
  valueSale: number;

  @ApiProperty({
    example: '200',
    description: 'Count of sales',
  })
  @IsInt()
  qtdSale: number;

  @ApiProperty({
    description: 'Date of sales',
  })
  @IsDate()
  @Type(() => Date)
  dateSale: Date;
}
