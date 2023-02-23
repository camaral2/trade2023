import { Test, TestingModule } from '@nestjs/testing';
import { AcaoService } from './acao.service';
import { RequestUtils } from '../utils';
import { getRepositoryToken } from '@nestjs/typeorm';
import { configAcao } from './entities/configAcao.entity';

import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';

describe('AcaoService', () => {
  let service: AcaoService;
  let request: RequestUtils;
  let configAcaoRepository: Repository<configAcao>;

  const dadoHtml = fs.readFileSync(
    path.join(__dirname, './mockpage.html'),
    'utf-8',
  );

  const mockConfigAcaoNotData = {
    _id: '625e14bdfc2cbba1de91d11a',
    acao: 'MGLU3',
    url: 'https://www.infomoney.com.br/cotacoes/b3/acao/magazine-luiza-mglu3/',
    sessao: '5bji9md82ahe',
    desc: 'Magazine Luiza (MGLU3)',
  };

  const mockDadosAcao = {
    acao: 'MGLU3',
    valueMin: 1.12,
    value: 2.22,
    valueMax: 3.32,
    dataAcao: new Date(),
  };

  const mockConfigAcaoWithData = {
    _id: '625e14bdfc2cbba1de91d11a',
    acao: 'MGLU3',
    url: 'https://www.infomoney.com.br/cotacoes/b3/acao/magazine-luiza-mglu3/',
    sessao: '5bji9md82ahe',
    desc: 'Magazine Luiza (MGLU3)',
    dadosAcao: mockDadosAcao,
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

  it('Should return value of ação today', async () => {
    const spyFindConfigAcao = jest
      .spyOn(configAcaoRepository, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(mockConfigAcaoNotData as configAcao),
      );

    const spyRequestFirst = jest
      .spyOn(request, 'getRequest')
      .mockResolvedValue(dadoHtml);

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
    const spyFindConfigAcao = jest
      .spyOn(configAcaoRepository, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(mockConfigAcaoWithData as configAcao),
      );

    const spyRequestSecound = jest
      .spyOn(request, 'getRequest')
      .mockResolvedValue(dadoHtml);

    const acao = 'MGLU3';
    const ret = await service.getAcaoToday(acao);

    expect(spyFindConfigAcao).toBeCalled();
    expect(request.getRequest).not.toBeCalled();
    expect(spyRequestSecound).not.toBeCalled();

    expect(ret).toMatchObject(mockDadosAcao);
  });

  it('Should not return value of ação today', async () => {
    const spyFindConfigAcao = jest
      .spyOn(configAcaoRepository, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(null));

    const acao = 'NONONO';

    await expect(service.getAcaoToday(acao)).rejects.toThrow(
      new UnauthorizedException({
        message: 'nomeAcao not found: (NONONO)',
      }),
    );

    expect(spyFindConfigAcao).toBeCalled();
  });
});
