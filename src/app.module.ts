import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompraModule } from './compra/compra.module';
import { join } from 'path';
import 'dotenv/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URL,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
      useNewUrlParser: true,
      logging: true,
      useUnifiedTopology: true,
    }),
    CompraModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
