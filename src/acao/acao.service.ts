import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AcaoDto } from './dto/acao.dto';
import { RequestUtils } from '../utils';
import cheerio from 'cheerio';
import logger from '../utils/logger';
import { configAcao } from './entities/configAcao.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class AcaoService {
  private readonly USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36';

  constructor(
    @InjectRepository(configAcao)
    private readonly configAcaoRepository: Repository<configAcao>,
    private requestUtils: RequestUtils,
  ) {}

  async getAcaoToday(nomeAcao: string): Promise<AcaoDto> {
    try {
      if (!nomeAcao || nomeAcao == undefined)
        throw new BadRequestException('nomeAcao is empty');

      const configA = await this.configAcaoRepository.findOne({
        where: { acao: nomeAcao },
      });

      if (!configA || configA == null)
        throw new NotFoundException(`nomeAcao not found: (${nomeAcao})`);

      logger.info(`configA.dadosAcao.dataAcao:[${configA.dadosAcao.dataAcao}]`);

      if (configA.dadosAcao && configA.dadosAcao.dataAcao) {
        const dateLimite = new Date();
        dateLimite.setMinutes(dateLimite.getMinutes() + 30); // timestamp

        //
        //Case the last get of acao then get data of record
        if (configA.dadosAcao.dataAcao < dateLimite) {
          logger.info(`Carregando os dados da acao salvo anteriormente`);

          const ret: AcaoDto = configA.dadosAcao;
          return ret;
        }
      }

      const url = configA.url;
      const headers = {
        Accept: 'text/html,*/*',
        'User-Agent': this.USER_AGENT,
      };

      const requestData = await this.requestUtils.getRequest(url, headers);

      if (!requestData) {
        logger.error(`Retornar null - requestData is null - url: [${url}]`);
        return null;
      }

      logger.info(`Retornou dados na consulta na url: [${url}]`);

      const $ = await cheerio.load(requestData);

      const parseMinimo = $('.minimo').children().first().text();
      const valorMinimo = Number(
        parseMinimo.replace('.', '').replace(',', '.'),
      );

      const parseValor = $('.value').children().first().text();
      const valorAtual = Number(parseValor.replace('.', '').replace(',', '.'));

      const parseMaximo = $('.maximo').children().first().text();
      const valorMaximo = Number(
        parseMaximo.replace('.', '').replace(',', '.'),
      );

      const ret: AcaoDto = {
        acao: nomeAcao,
        valueMin: +valorMinimo,
        value: +valorAtual,
        valueMax: +valorMaximo,
        dataAcao: new Date(),
      };

      const retSave = await this.configAcaoRepository.update(
        { _id: configA._id },
        { dadosAcao: ret },
      );

      console.log('retSave');
      console.dir(retSave);

      return ret;
    } catch (err) {
      logger.error(`Error: ${err} - [${nomeAcao}]`);
      throw err;
    }
  }
}
