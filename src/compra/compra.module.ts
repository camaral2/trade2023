import { Module } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CompraController } from './compra.controller';
import { Compra } from './entities/compra.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Compra])],
  controllers: [CompraController],
  providers: [CompraService],
})
export class CompraModule {}
