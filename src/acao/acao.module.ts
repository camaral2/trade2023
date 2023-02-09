import { Module } from '@nestjs/common';
import { AcaoService } from './acao.service';
import { AcaoController } from './acao.controller';
@Module({
  controllers: [AcaoController],
  providers: [AcaoService],
  exports: [AcaoService],
})
export class AcaoModule {}
