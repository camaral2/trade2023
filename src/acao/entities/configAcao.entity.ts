import { Entity, Column, BaseEntity, ObjectIdColumn } from 'typeorm';

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

  constructor(obj?: Partial<configAcao>) {
    super();
    Object.assign(this, obj);
  }
}
