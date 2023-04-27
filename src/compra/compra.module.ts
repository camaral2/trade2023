import { Module } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CompraController } from './compra.controller';
import { Compra } from './entities/compra.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcaoModule } from '../acao/acao.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compra]),
    AcaoModule,
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: {
          host: '200.98.128.106',
          port: 31074,
        },
      },
    ]),
  ],
  controllers: [CompraController],
  providers: [CompraService],
})
export class CompraModule {}
