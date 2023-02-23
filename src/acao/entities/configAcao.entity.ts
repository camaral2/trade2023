import { Entity, Column, BaseEntity, ObjectIdColumn } from 'typeorm';
import { AcaoDto } from '../dto/acao.dto';

@Entity('configAcao')
export class configAcao extends BaseEntity {
  @ObjectIdColumn({ primary: true })
  _id: string;

  @Column({ nullable: false, unique: true })
  acao: string;

  @Column({ nullable: false })
  url: string;

  @Column()
  sessao: string;

  @Column()
  desc: string;

  @Column()
  data: Date;

  @Column()
  dadosAcao: AcaoDto;

  constructor(obj?: Partial<configAcao>) {
    super();
    Object.assign(this, obj);
  }
}
