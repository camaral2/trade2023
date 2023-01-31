import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import logger from '../utils/logger';
import { Repository } from 'typeorm';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Compra } from './entities/compra.entity';

@Injectable()
export class CompraService {
  constructor(
    @InjectRepository(Compra)
    private readonly usersRepository: Repository<Compra>,
  ) {}

  async findAll(userFilter: string): Promise<Compra[]> {
    try {
      const arr = await this.usersRepository.find({
        where: { user: userFilter },
      });

      arr.forEach((row) => {
        this.prepareRegister(row);
      });

      return arr;
    } catch (err) {
      logger.error(`Error: ${err} - [${userFilter}]`);
      throw err;
    }
  }

  private prepareRegister(dataOld: Compra): Compra {
    if (!(dataOld.valueNow > 0) && !(dataOld.valueSale > 0)) {
      dataOld.valueNow = 4.89;
      dataOld.dateValue = new Date();
    }

    if (dataOld.valueNow > 0) {
      dataOld = this.setValues(dataOld.valueNow, dataOld);
    } else {
      dataOld = this.setValues(dataOld.valueSale, dataOld);
    }
    return dataOld;
  }

  private setValues(value: number, dataEntity: Compra): Compra {
    dataEntity.saleSum = value * dataEntity.qtd;
    dataEntity.valueSum = dataEntity.valor * dataEntity.qtd;
    dataEntity.valueAdd = dataEntity.saleSum - dataEntity.valueSum;
    dataEntity.percentAdd = (dataEntity.saleSum * 100) / dataEntity.valueSum;

    return dataEntity;
  }

  findOne(id: string) {
    return `This action returns a #${id} compra`;
  }

  create(createCompraDto: CreateCompraDto) {
    return 'This action adds a new compra';
  }

  update(id: number, updateCompraDto: UpdateCompraDto) {
    return `This action updates a #${id} compra`;
  }

  remove(id: number) {
    return `This action removes a #${id} compra`;
  }
}
