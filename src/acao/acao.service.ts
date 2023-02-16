import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AcaoDto } from './dto/acao.dto';
import { RequestUtils } from '../utils';
import cheerio from 'cheerio';
import logger from '../utils/logger';

// jest.mock('axios', () => ({
//   post: () => Promise.resolve({ data: 'data' }),
// }));

@Injectable()
export class AcaoService {
  private readonly USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36';

  constructor(private requestUtils: RequestUtils) {}

  async getAcaoToday(nomeAcao: string): Promise<AcaoDto> {
    const url =
      'https://www.infomoney.com.br/cotacoes/b3/acao/magazine-luiza-mglu3/';
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
    const valorMinimo = Number(parseMinimo.replace('.', '').replace(',', '.'));

    const parseValor = $('.value').children().first().text();
    const valorAtual = Number(parseValor.replace('.', '').replace(',', '.'));

    const parseMaximo = $('.maximo').children().first().text();
    const valorMaximo = Number(parseMaximo.replace('.', '').replace(',', '.'));

    /*

    // 👇️ const data: GetUsersResponse
    const { data, status } = await this.http
      .get(
        'https://www.infomoney.com.br/cotacoes/b3/acao/magazine-luiza-mglu3/',
      )
      .catch((err) => {
        throw new ForbiddenException('API not available' + err);
      });

    console.log(data);
    //console.log(JSON.stringify(data, null, 4));

    // 👇️ "response status is: 200"
    console.log('response status is: ', status);
*/
    const ret: AcaoDto = {
      acao: nomeAcao,
      valueMin: +valorMinimo,
      value: +valorAtual,
      valueMax: +valorMaximo,
    };

    return ret;
  }
}
