import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompraService } from './compra.service';
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

const listCompraMock = [{ ...compraMock }];

describe('CompraService', () => {
  let service: CompraService;
  let compraRepository: Repository<Compra>;

  const mockCompraRepository = () => ({
    find: jest.fn(() => Promise.resolve(listCompraMock)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

      expect(ret[0].valueSum).toBeDefined();
      expect(ret[0].valueSum).toBeGreaterThan(0);

      expect(ret[0].saleSum).toBeDefined();
      expect(ret[0].valueAdd).toBeDefined();
      expect(ret[0].percentAdd).toBeDefined();
    });

    //Find com valor de venda (calcular os campos)
    //Find com valor do dia (calcular os campos)
  });
});
