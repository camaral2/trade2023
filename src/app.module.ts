import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompraModule } from './compra/compra.module';
import { join } from 'path';
import 'dotenv/config';

@Module({
  imports: [
    CompraModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URL,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
      useNewUrlParser: true,
      logging: true,
      useUnifiedTopology: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
