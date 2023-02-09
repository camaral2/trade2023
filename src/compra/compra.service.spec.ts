import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompraService } from './compra.service';
import { AcaoService } from '../acao/acao.service';
import { Compra } from './entities/compra.entity';
import { faker } from '@faker-js/faker';
import * as uuid from 'uuid';

const compraMock = {
  _id: uuid.v4(),
  data: new Date(),
  acao: faker.company.bsNoun(),
  qtd: Number(faker.random.numeric(2)),
  user: uuid.v4(),
  valor: Number(faker.commerce.price()),
};

const valorAcao = 6.89;

const listCompraMock = [{ ...compraMock }];

describe('CompraService', () => {
  let service: CompraService;
  let compraRepository: Repository<Compra>;

  const mockCompraRepository = () => ({
    find: jest.fn(() => Promise.resolve(listCompraMock)),
    findone: jest.fn(() => Promise.resolve(compraMock)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcaoService,
        CompraService,
        {
          provide: getRepositoryToken(Compra),
          useFactory: mockCompraRepository,
        },
      ],
    }).compile();

    service = module.get<CompraService>(CompraService);
    compraRepository = module.get<Repository<Compra>>(
      getRepositoryToken(Compra),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find of compra', () => {
    it('Should return all compra register', async () => {
      const ret = await service.findAll(compraMock.user);

      expect(compraRepository.find).toBeCalled();
      expect(ret.length).toEqual(listCompraMock.length);
    });

    it('Should return compra register not sales', async () => {
      const ret = await service.findOne(compraMock._id);

      expect(compraRepository.findOne).toBeCalled();

      const totalCompra = compraMock.valor * compraMock.qtd;
      expect(ret.valueSum).toEqual(totalCompra);

      const totalVenda = valorAcao * compraMock.qtd;
      expect(ret.saleSum).toEqual(totalVenda);

      const diferenca = totalVenda - totalCompra;
      const percentual = (diferenca * 100) / totalCompra;
      expect(ret.valueAdd).toEqual(diferenca);
      expect(ret.percentAdd).toEqual(percentual);
    });
    //Find com valor de venda (calcular os campos)
    //Find com valor do dia (calcular os campos)
  });
});
