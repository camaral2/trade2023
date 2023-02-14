import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompraService } from './compra.service';
import { AcaoService } from '../acao/acao.service';
import { Compra } from './entities/compra.entity';
import { faker } from '@faker-js/faker';
import * as uuid from 'uuid';
import { AcaoDto } from '../acao/dto/acao.dto';
import { util } from '../utils';

const compraMockNotSales = {
  _id: uuid.v4(),
  data: new Date(),
  acao: faker.company.bsNoun(),
  qtd: 30, // Number(faker.random.numeric(2)),
  user: uuid.v4(),
  valor: 6.8, // Number(faker.commerce.price()),
};

const compraMockSales = {
  _id: uuid.v4(),
  data: new Date(),
  acao: faker.company.bsNoun(),
  qtd: 30, // Number(faker.random.numeric(2)),
  user: uuid.v4(),
  valor: 6.8, // Number(faker.commerce.price()),
  valueSale: 6.9,
};

const acaoMock: AcaoDto = {
  acao: 'MGLU3',
  value: 6.9,
  valueMin: 5.11,
  valueMax: 7.23,
};

const listCompraMock = [{ ...compraMockNotSales, compraMockSales }];

describe('CompraService', () => {
  let service: CompraService;
  let serviceAcao: AcaoService;
  let compraRepository: Repository<Compra>;

  const mockCompraRepository = () => ({
    find: jest.fn(() => Promise.resolve(listCompraMock)),
    findOne: jest.fn(() => Promise.resolve(compraMockNotSales)),
  });

  const mockAcaoService = () => ({
    getAcaoToday: jest.fn(() => Promise.resolve(acaoMock)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcaoService,
        {
          provide: AcaoService,
          useFactory: mockAcaoService,
        },
        CompraService,
        {
          provide: getRepositoryToken(Compra),
          useFactory: mockCompraRepository,
        },
      ],
    }).compile();

    service = module.get<CompraService>(CompraService);
    serviceAcao = module.get<AcaoService>(AcaoService);
    compraRepository = module.get<Repository<Compra>>(
      getRepositoryToken(Compra),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find of compra', () => {
    it('Should return all compra register', async () => {
      const ret = await service.findAll(compraMockNotSales.user);

      expect(compraRepository.find).toBeCalled();
      expect(ret.length).toEqual(listCompraMock.length);
    });

    it('Should return compra register not sales', async () => {
      const spyCompraNotSales = jest
        .spyOn(serviceAcao, 'getAcaoToday')
        .mockImplementationOnce(() => Promise.resolve(acaoMock));

      const ret = await service.findOne(compraMockNotSales._id);

      expect(compraRepository.findOne).toBeCalled();
      expect(spyCompraNotSales).toBeCalled();

      const totalCompra = util.numero(
        compraMockNotSales.valor * compraMockNotSales.qtd,
        2,
      );
      expect(ret.valueSum).toEqual(totalCompra);

      const totalVenda = util.numero(
        acaoMock.value * compraMockNotSales.qtd,
        2,
      );
      expect(ret.saleSum).toEqual(totalVenda);

      //console.dir(ret);
      //console.dir(acaoMock);

      const diferenca = util.numero(totalVenda - totalCompra, 2);
      const percentual = util.numero((diferenca * 100) / totalCompra, 2);
      expect(ret.valueAdd).toEqual(diferenca);
      expect(ret.percentAdd).toEqual(percentual);
    });
  });

  it('Should return compra register sales', async () => {
    const spyCompraSales = jest
      .spyOn(compraRepository, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(compraMockSales as Compra));

    const ret = await service.findOne(compraMockNotSales._id);

    expect(compraRepository.findOne).toBeCalled();
    expect(spyCompraSales).toBeCalled();

    const totalCompra = util.numero(
      compraMockNotSales.valor * compraMockNotSales.qtd,
      2,
    );
    expect(ret.valueSum).toEqual(totalCompra);

    const totalVenda = util.numero(
      compraMockSales.valueSale * compraMockNotSales.qtd,
      2,
    );
    expect(ret.saleSum).toEqual(totalVenda);

    //console.dir(ret);
    //console.dir(acaoMock);

    const diferenca = util.numero(totalVenda - totalCompra, 2);
    const percentual = util.numero((diferenca * 100) / totalCompra, 2);
    expect(ret.valueAdd).toEqual(diferenca);
    expect(ret.percentAdd).toEqual(percentual);
  });
});
