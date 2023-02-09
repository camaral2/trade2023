import { ForbiddenException, Injectable } from '@nestjs/common';
import { AcaoDto } from './dto/acao.dto';
import { RequestUtils } from '../utils';
import cheerio from 'cheerio';

// jest.mock('axios', () => ({
//   post: () => Promise.resolve({ data: 'data' }),
// }));

@Injectable()
export class AcaoService {
  private readonly USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36';

  async getAcaoToday(nomeAcao: string): Promise<AcaoDto> {
    console.log('getAcaoToday:', nomeAcao);

    const url =
      'https://www.infomoney.com.br/cotacoes/b3/acao/magazine-luiza-mglu3/';
    const headers = {
      Accept: 'text/html,*/*',
      'User-Agent': this.USER_AGENT,
    };

    const requestData = await RequestUtils.getRequest(url, headers);

    if (!requestData || !requestData.items) {
      return null;
    }

    const $ = await cheerio.load(requestData);

    const parseMinimo = $('.minimo').children().first().text();
    const valorMinimo = Number(parseMinimo.replace('.', '').replace(',', '.'));

    const parseValor = $('.value').children().first().text();
    const valorAtual = Number(parseValor.replace('.', '').replace(',', '.'));

    const parseMaximo = $('.maximo').children().first().text();
    const valorMaximo = Number(parseMaximo.replace('.', '').replace(',', '.'));

    console.log('valorMinimo:', valorMinimo);
    console.log('valorAtual:', valorAtual);
    console.log('valorMaximo:', valorMaximo);

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
