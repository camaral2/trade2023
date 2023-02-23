//https://dominicarrojado.com/posts/building-a-link-shortener-api-with-nestjs-and-mongodb-with-tests-part-2/
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { faker } from '@faker-js/faker';
import * as uuid from 'uuid';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let api;

  const userId = uuid.v4();
  let idCompra: any;
  const mockCompra = {
    user: userId,
    acao: 'BSLI3',
    data: new Date(),
    valor: +2.1,
    qtd: 200,
  };

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

  describe.only('Create', () => {
    it('Should create a new compra of user', async () => {
      const resp = await request(api).post('/compra').send(mockCompra);
      //.set('Authorization', `Bearer ${jwtToken}`)
      //.expect(HttpStatus.CREATED);

      console.dir(resp.text);

      expect(resp.status).toEqual(HttpStatus.CREATED);

      expect(resp.body._id).toBeDefined();
      expect(resp.body._id).not.toBeNull();

      idCompra = resp.body._id;
    });
  });

  describe.only('List', () => {
    it('Should list all compra of user', async () => {
      const resp = await request(api)
        .get(`/compra/user/${userId}`)
        //.set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.OK);

      expect(resp.body[0]._id).toBeDefined();
      expect(resp.body[0]._id).not.toBeNull();
    });
  });

  describe.only('Findone', () => {
    let respFirst;
    it('Should found a compra', async () => {
      respFirst = await request(api)
        .get(`/compra/${idCompra}`)
        //.set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.OK);

      expect(respFirst.body._id).toBeDefined();
      expect(respFirst.body._id).not.toBeNull();

      expect(respFirst.body.valueNow).toBeDefined();
      expect(respFirst.body.valueNow).toBeGreaterThan(0);

      expect(respFirst.body.saleSum).toBeDefined();
      expect(respFirst.body.saleSum).toBeGreaterThan(0);

      expect(respFirst.body.valueSum).toBeDefined();
      expect(respFirst.body.valueSum).toBeGreaterThan(0);

      expect(respFirst.body.valueAdd).toBeDefined();
      expect(respFirst.body.valueAdd).toBeGreaterThan(0);

      expect(respFirst.body.percentAdd).toBeDefined();
      expect(respFirst.body.percentAdd).toBeGreaterThan(0);

      expect(respFirst.body.dateValue).toBeDefined();

      //console.log('respFirst.body');
      //console.dir(respFirst.body);
    });

    it('Should found the same a compra and values', async () => {
      const respSecound = await request(api)
        .get(`/compra/${idCompra}`)
        //.set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.OK);

      expect(respSecound.body._id).toBeDefined();
      expect(respSecound.body._id).not.toBeNull();

      expect(respSecound.body.valueNow).toBeDefined();
      expect(respSecound.body.valueNow).toEqual(respFirst.body.valueNow);

      expect(respSecound.body.saleSum).toBeDefined();
      expect(respSecound.body.saleSum).toEqual(respFirst.body.saleSum);

      expect(respSecound.body.valueSum).toBeDefined();
      expect(respSecound.body.valueSum).toEqual(respFirst.body.valueSum);

      expect(respSecound.body.valueAdd).toBeDefined();
      expect(respSecound.body.valueAdd).toEqual(respFirst.body.valueAdd);

      expect(respSecound.body.percentAdd).toBeDefined();
      expect(respSecound.body.percentAdd).toEqual(respFirst.body.percentAdd);

      expect(respSecound.body.dateValue).toBeDefined();
      expect(respSecound.body.dateValue).toEqual(respFirst.body.dateValue);
    });
  });
});
