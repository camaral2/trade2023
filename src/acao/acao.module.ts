import { Module } from '@nestjs/common';
import { AcaoService } from './acao.service';
import { AcaoController } from './acao.controller';
import { RequestUtils } from '../utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configAcao } from './entities/configAcao.entity';

@Module({
  controllers: [AcaoController],
  imports: [TypeOrmModule.forFeature([configAcao])],
  providers: [AcaoService, RequestUtils],
  exports: [AcaoService],
})
export class AcaoModule {}
