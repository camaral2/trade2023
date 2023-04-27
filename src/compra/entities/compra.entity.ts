import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, BaseEntity, ObjectIdColumn } from 'typeorm';

@Entity('compra')
export class Compra extends BaseEntity {
  @ObjectIdColumn()
  _id: string;

  @ApiProperty({
    example: '63b34f5da25fbb24d295ab24',
    description: 'The identifiquer the user of build',
  })
  @Column({ nullable: false })
  user: string;

  @ApiProperty({
    example: 'MGLU3',
    description: 'The name of stock shares',
  })
  @Column({ nullable: false })
  acao: string;

  @ApiProperty({
    example: '2022-04-06T00:00:00.000+00:00',
    description: 'Date of build stock shares',
  })
  @Column({ nullable: false })
  data: Date;

  @ApiProperty({
    example: '23.98',
    description: 'Value of build stock shares',
  })
  @Column({ nullable: false, type: 'money' })
  valor: number;

  @ApiProperty({
    example: '200',
    description: 'Count of build stock shares',
  })
  @Column({ nullable: false, type: 'int' })
  qtd: number;

  @ApiProperty({
    example: '23.98',
    description: 'Value of sales stock shares',
  })
  @Column({ type: 'money' })
  valueSale: number;

  @ApiProperty({
    example: '200',
    description: 'Count of sales stock shares',
  })
  @Column({
    type: 'int',
  })
  qtdSale: number;

  @ApiProperty({
    example: '2022-04-06T00:00:00.000+00:00',
    description: 'Date of sales stock shares',
  })
  @Column()
  dateSale: Date;

  @Column({ type: 'money' })
  valueSum: number;

  @Column({ type: 'money' })
  valueNow: number;

  @Column()
  dateValue: Date;

  @Column({ type: 'money' })
  saleSum: number;

  @Column({ type: 'money' })
  valueAdd: number;

  @Column({ type: 'money' })
  percentAdd: number;

  constructor(compra?: Partial<Compra>) {
    super();
    Object.assign(this, compra);
  }
}
