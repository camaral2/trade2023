import { Module } from '@nestjs/common';
import { AcaoService } from './acao.service';
import { AcaoController } from './acao.controller';
import { RequestUtils } from '../utils';

@Module({
  controllers: [AcaoController],
  providers: [AcaoService, RequestUtils],
  exports: [AcaoService],
})
export class AcaoModule {}
