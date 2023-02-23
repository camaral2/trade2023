import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';

@Controller('compra')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @Post()
  async create(@Body() createCompraDto: CreateCompraDto) {
    return await this.compraService.create(createCompraDto);
  }

  @Get('user/:user')
  async findAll(@Param('user') user: string) {
    return await this.compraService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.compraService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompraDto: UpdateCompraDto,
  ) {
    return await this.compraService.update(+id, updateCompraDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.compraService.remove(id);
  }
}
