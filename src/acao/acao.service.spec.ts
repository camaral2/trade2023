import { Test, TestingModule } from '@nestjs/testing';
import { AcaoService } from './acao.service';

describe('AcaoService', () => {
  let service: AcaoService;
  const mockAcao = {
    acao: 'MGLU3',
    value: 5.89,
    valueMax: 8.78,
    valueMin: 4.22,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcaoService],
    }).compile();

    service = module.get<AcaoService>(AcaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return value of ação today', async () => {
    const ret = await service.getAcaoToday(mockAcao.acao);

    //expect(compraRepository.find).toBeCalled();
    expect(ret).toEqual(mockAcao);
  });
});
