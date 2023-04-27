import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      app: 'Trade2023',
      version: process.env.npm_package_version,
      author: 'Cristian dos Santos Amaral',
      email: 'cristian_amaral@hotmail.com',
    };
  }
}
