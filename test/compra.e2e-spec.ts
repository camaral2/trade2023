//https://dominicarrojado.com/posts/building-a-link-shortener-api-with-nestjs-and-mongodb-with-tests-part-2/
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { faker } from '@faker-js/faker';
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let api;

  const userId = '63b34f5da25fbb24d295ab24';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    //app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    api = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('List', () => {
    it('Should list all compra of user', async () => {
      const resp = await request(api)
        .get(`/compra/user/${userId}`)
        //.set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.OK);

      console.dir(resp.body);

      expect(resp.body._id).toBeDefined();
      expect(resp.body._id).not.toBeNull();

      /*
      {
        _id: '636ebd14e7fa8691ec7f97cc',
        user: '63b34f5da25fbb24d295ab24',
        acao: '',
        data: '2022-11-11T00:00:00.000Z',
        valor: 3.7,
        qtd: 200
      },
      */
    });
  });
});
