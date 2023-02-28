import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { ReturnDeleteUpdateDto } from './dto/return-delete-update-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Compra } from './entities/compra.entity';

@Controller('compra')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @Post()
  async create(@Body() createCompraDto: CreateCompraDto): Promise<Compra> {
    return await this.compraService.create(createCompraDto);
  }

  @Get('user/:user')
  async findAll(@Param('user') user: string): Promise<Compra[]> {
    return await this.compraService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Compra> {
    return await this.compraService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCompraDto: UpdateCompraDto,
  ): Promise<ReturnDeleteUpdateDto> {
    return await this.compraService.update(id, updateCompraDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<number | null> {
    return await this.compraService.remove(id);
  }
}
