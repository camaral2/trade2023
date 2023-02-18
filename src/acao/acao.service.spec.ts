import { Test, TestingModule } from '@nestjs/testing';
import { AcaoService } from './acao.service';
import { RequestUtils } from '../utils';
import { getRepositoryToken } from '@nestjs/typeorm';
import { configAcao } from './entities/configAcao.entity';

import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';

describe('AcaoService', () => {
  let service: AcaoService;
  let request: RequestUtils;
  let configAcaoRepository: Repository<configAcao>;

  const dadoHtmlFirst = fs.readFileSync(
    path.join(__dirname, './mockpage_1.html'),
    'utf-8',
  );

  const dadoHtmlSecound = fs.readFileSync(
    path.join(__dirname, './mockpage_2.html'),
    'utf-8',
  );

  const mockConfigAcaoNotData = {
    _id: '625e14bdfc2cbba1de91d11a',
    acao: 'MGLU3',
    url: 'https://www.infomoney.com.br/cotacoes/b3/acao/magazine-luiza-mglu3/',
    sessao: '5bji9md82ahe',
    desc: 'Magazine Luiza (MGLU3)',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestUtils,
        AcaoService,
        {
          provide: getRepositoryToken(configAcao),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AcaoService>(AcaoService);
    request = module.get<RequestUtils>(RequestUtils);
    configAcaoRepository = module.get<Repository<configAcao>>(
      getRepositoryToken(configAcao),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.only('Should return value of ação today', async () => {
    const spyFindConfigAcao = jest
      .spyOn(configAcaoRepository, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(mockConfigAcaoNotData as configAcao),
      );

    const spyRequestFirst = jest
      .spyOn(request, 'getRequest')
      .mockResolvedValue(dadoHtmlFirst);

    const acao = 'MGLU3';
    const ret = await service.getAcaoToday(acao);

    expect(request.getRequest).toBeCalled();
    expect(spyFindConfigAcao).toBeCalled();
    expect(spyRequestFirst).toBeCalled();

    expect(ret.acao).toEqual(acao);
    expect(ret.value).toEqual(4.06);
    expect(ret.valueMin).toEqual(4.01);
    expect(ret.valueMax).toEqual(4.22);
  });

  it('Should return value of ação today in secound get', async () => {
    const spyRequestSecound = jest
      .spyOn(request, 'getRequest')
      .mockResolvedValue(dadoHtmlSecound);

    const acao = 'MGLU3';
    const ret = await service.getAcaoToday(acao);

    expect(request.getRequest).toBeCalled();
    expect(spyRequestSecound).toBeCalled();

    expect(ret.acao).toEqual(acao);
    expect(ret.value).toEqual(4.06);
    expect(ret.valueMin).toEqual(4.01);
    expect(ret.valueMax).toEqual(4.22);
  });

  it('Should not return value of ação today', async () => {
    const spyRequestNull = jest
      .spyOn(request, 'getRequest')
      .mockResolvedValue(null);

    const acao = 'NONONO';
    const ret = await service.getAcaoToday(acao);

    expect(request.getRequest).toBeCalled();
    expect(spyRequestNull).toBeCalled();

    expect(ret).toEqual(null);
  });
});
