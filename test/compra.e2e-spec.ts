//https://dominicarrojado.com/posts/building-a-link-shortener-api-with-nestjs-and-mongodb-with-tests-part-2/
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
//import { faker } from '@faker-js/faker';
import * as uuid from 'uuid';
import { CreateCompraDto } from 'src/compra/dto/create-compra.dto';
import { UpdateCompraDto } from 'src/compra/dto/update-compra.dto';

//https://github.com/nestjs/nest/issues/76

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let api;
  const urlAuth = process.env.ADM_URL;

  const userId = uuid.v4();
  let jwtToken = '';
  const jwtTokenFake =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const username = process.env.ADM_USER;
  const password = process.env.ADM_PASSWD;

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

  describe('POST /auth/login', () => {
    it('Should validate the payload', async () => {
      await request(urlAuth)
        .post('auth/login')
        .send({})
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return Unauthorised on bad credentials', async () => {
      await request(urlAuth)
        .post('auth/login')
        .send({ username, password: 'incorrect' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should log a user in and return a JWT token', async () => {
      await request(urlAuth)
        .post('auth/login')
        .send({ username, password })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body.username).toEqual(username);
          expect(res.body.password).toBeUndefined();
          expect(res.body.token.access_token).toBeDefined();

          //console.dir(res.body);

          jwtToken = res.body.token.access_token;

          expect(jwtToken).toMatch(
            /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
          ); // jwt regex

          console.log('Token recebido:', jwtToken);
        });
    });
  });

  describe('Compra security send token empty', () => {
    const idCompraSecurity = uuid.v4();
    const mockCompraSecurity: CreateCompraDto = {
      user: userId,
      acao: 'BSLI3',
      data: new Date(),
      valor: 5,
      qtd: 200,
    };
    const mockSalesSecurity: UpdateCompraDto =
      mockCompraSecurity as UpdateCompraDto;

    it('Should create a new compra of user', async () => {
      await request(api)
        .post('/compra')
        .send(mockCompraSecurity)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Should found a compra', async () => {
      await request(api)
        .get(`/compra/${idCompraSecurity}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Should list all compra of user', async () => {
      await request(api)
        .get(`/compra/user/${userId}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Should set a compra the sales', async () => {
      mockSalesSecurity.qtdSale = 100;
      mockSalesSecurity.valueSale = 7.5;
      mockSalesSecurity.dateSale = new Date();

      await request(api)
        .put(`/compra/${idCompraSecurity}`)
        .send(mockSalesSecurity)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Should delete a new compra of user', async () => {
      await request(api)
        .delete(`/compra/${idCompraSecurity}`)
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('Compra security send token faker', () => {
    const idCompraSecurity = uuid.v4();
    const mockCompraSecurity: CreateCompraDto = {
      user: userId,
      acao: 'BSLI3',
      data: new Date(),
      valor: 5,
      qtd: 200,
    };
    const mockSalesSecurity: UpdateCompraDto =
      mockCompraSecurity as UpdateCompraDto;

    it('Should create a new compra of user', async () => {
      await request(api)
        .post('/compra')
        .send(mockCompraSecurity)
        .set('Authorization', `Bearer ${jwtTokenFake}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Should found a compra', async () => {
      await request(api)
        .get(`/compra/${idCompraSecurity}`)
        .set('Authorization', `Bearer ${jwtTokenFake}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Should list all compra of user', async () => {
      await request(api)
        .get(`/compra/user/${userId}`)
        .set('Authorization', `Bearer ${jwtTokenFake}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Should set a compra the sales', async () => {
      mockSalesSecurity.qtdSale = 100;
      mockSalesSecurity.valueSale = 7.5;
      mockSalesSecurity.dateSale = new Date();

      await request(api)
        .put(`/compra/${idCompraSecurity}`)
        .send(mockSalesSecurity)
        .set('Authorization', `Bearer ${jwtTokenFake}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Should delete a new compra of user', async () => {
      await request(api)
        .delete(`/compra/${idCompraSecurity}`)
        .set('Authorization', `Bearer ${jwtTokenFake}`)
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('Compra without value sales', () => {
    let idCompra: any;
    let respFirst;

    const mockCompra: CreateCompraDto = {
      user: userId,
      acao: 'BSLI3',
      data: new Date(),
      valor: 5,
      qtd: 200,
    };

    const mockSales: UpdateCompraDto = mockCompra as UpdateCompraDto;

    it('Should create a new compra of user', async () => {
      const resp = await request(api)
        .post('/compra')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(mockCompra);

      expect(resp.status).toEqual(HttpStatus.CREATED);

      expect(resp.body._id).toBeDefined();
      expect(resp.body._id).not.toBeNull();

      idCompra = resp.body._id;
    });

    it('Should found a compra', async () => {
      respFirst = await request(api)
        .get(`/compra/${idCompra}`)
        .set('Authorization', `Bearer ${jwtToken}`)
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
    });

    it('Should found the same a compra and values', async () => {
      const respSecound = await request(api)
        .get(`/compra/${idCompra}`)
        .set('Authorization', `Bearer ${jwtToken}`)
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

    it('Should list all compra of user', async () => {
      const resp = await request(api)
        .get(`/compra/user/${userId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.OK);

      expect(resp.body[0]._id).toBeDefined();
      expect(resp.body[0]._id).not.toBeNull();
    });

    it('Should set a compra the sales', async () => {
      mockSales.qtdSale = 100;
      mockSales.valueSale = 7.5;
      mockSales.dateSale = new Date();

      const resp = await request(api)
        .put(`/compra/${idCompra}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(mockSales);

      expect(resp.body.affected).toEqual(1);
      expect(resp.status).toEqual(HttpStatus.OK);
    });

    it('Should found a compra after Sales', async () => {
      const resp = await request(api)
        .get(`/compra/${idCompra}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.OK);

      expect(resp.body._id).toBeDefined();
      expect(resp.body._id).not.toBeNull();

      expect(resp.body.valueNow).not.toBeDefined();

      expect(resp.body.saleSum).toBeDefined();
      expect(resp.body.saleSum).toEqual(
        mockSales.qtdSale * mockSales.valueSale,
      );

      expect(resp.body.valueSum).toBeDefined();
      expect(resp.body.valueSum).toEqual(mockSales.qtdSale * resp.body.valor);

      expect(resp.body.valueAdd).toBeDefined();
      expect(resp.body.valueAdd).toBeGreaterThan(0);

      expect(resp.body.percentAdd).toBeDefined();
      expect(resp.body.percentAdd).toEqual(50);

      expect(resp.body.dateSale).toBeDefined();
    });

    it('Should delete a new compra of user', async () => {
      const resp = await request(api)
        .delete(`/compra/${idCompra}`)
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(resp.status).toEqual(HttpStatus.OK);
    });

    it('Should found the a compra of delete', async () => {
      const respSecound = await request(api)
        .get(`/compra/${idCompra}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(/Id not found/);
      expect(respSecound.body._id).not.toBeDefined();
    });
  });
});
