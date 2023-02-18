import { Entity, Column, BaseEntity, ObjectIdColumn } from 'typeorm';
import { AcaoDto } from '../dto/acao.dto';

@Entity('configAcao')
export class configAcao extends BaseEntity {
  @ObjectIdColumn()
  _id: string;

  @Column({ nullable: false })
  acao: string;

  @Column({ nullable: false })
  url: string;

  sessao: string;
  desc: string;

  data: Date;
  dadosAcao: AcaoDto;

  constructor(obj?: Partial<configAcao>) {
    super();
    Object.assign(this, obj);
  }
}
