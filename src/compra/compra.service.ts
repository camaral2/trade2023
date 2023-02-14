//https://github.com/rizama/marketplace-api-search/blob/main/src/jaknot/jaknot.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import logger from '../utils/logger';
import { Repository } from 'typeorm';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Compra } from './entities/compra.entity';
import { AcaoService } from '../acao/acao.service';
import { AcaoDto } from '../acao/dto/acao.dto';
import { util } from '../utils';

@Injectable()
export class CompraService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
    private readonly acaoService: AcaoService,
  ) {}

  async findAll(userFilter: string): Promise<Compra[]> {
    try {
      const arr = await this.compraRepository.find({
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

  async findOne(id: string): Promise<Compra> {
    try {
      if (!id || id == undefined) throw new BadRequestException('id is empty');

      const compra = await this.compraRepository.findOne({
        where: { _id: id },
      });
      if (!compra) throw new NotFoundException(`Id not found: (${id})`);

      return this.prepareRegister(compra);
    } catch (err) {
      logger.error(`Error: ${err} - [findOne: ${id}]`);
      throw err;
    }
  }

  private async prepareRegister(dataOld: Compra): Promise<Compra> {
    if (!(dataOld.valueNow > 0) && !(dataOld.valueSale > 0)) {
      const ret: AcaoDto = await this.acaoService.getAcaoToday(dataOld.acao);

      if (ret) {
        dataOld.valueNow = ret.value;
        dataOld.dateValue = new Date();
      }
    }

    if (dataOld.valueNow > 0) {
      dataOld = await this.setValues(dataOld.valueNow, dataOld);
    } else {
      dataOld = await this.setValues(dataOld.valueSale, dataOld);
    }
    return dataOld;
  }

  private async setValues(value: number, dataEntity: Compra): Promise<Compra> {
    dataEntity.saleSum = util.numero(value * dataEntity.qtd, 2);
    dataEntity.valueSum = util.numero(dataEntity.valor * dataEntity.qtd, 2);
    dataEntity.valueAdd = util.numero(
      dataEntity.saleSum - dataEntity.valueSum,
      2,
    );

    //console.log('dataEntity.valueSum:', dataEntity.valueSum);
    //console.log('dataEntity.saleSum:', dataEntity.saleSum);

    const percentAdd = util.percent(dataEntity.valueSum, dataEntity.saleSum, 2);
    dataEntity.percentAdd = percentAdd;

    //console.log('dataEntity.percentAdd:', dataEntity.percentAdd);

    return dataEntity;
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
