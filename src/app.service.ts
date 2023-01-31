import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      app: 'Trade2023',
      author: 'Cristian dos Santos Amaral',
      email: 'cristian_amaral@hotmail.com',
    };
  }
}
