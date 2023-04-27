import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  UseGuards,
  UsePipes,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth-guard';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { ReturnDeleteUpdateDto } from './dto/return-delete-update-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Compra } from './entities/compra.entity';
import { HttpExceptionFilter } from '../utils/filter';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('compra')
@Controller('compra')
@UseFilters(new HttpExceptionFilter())
@UsePipes(new ValidationPipe())
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @ApiOperation({ description: 'Create a new compra' })
  @Post()
  async create(@Body() createCompraDto: CreateCompraDto): Promise<Compra> {
    return await this.compraService.create(createCompraDto);
  }

  @ApiOperation({ description: 'Get All compra of User' })
  @Get('user/:user')
  async findAll(@Param('user') user: string): Promise<Compra[]> {
    return await this.compraService.findAll(user);
  }

  @ApiOperation({ description: 'Get a compra' })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Compra> {
    return await this.compraService.findOne(id);
  }

  @ApiOperation({ description: 'Set sales of compra' })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCompraDto: UpdateCompraDto,
  ): Promise<ReturnDeleteUpdateDto> {
    return await this.compraService.update(id, updateCompraDto);
  }

  @ApiOperation({ description: 'Delete a compra' })
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<number | null> {
    return await this.compraService.remove(id);
  }
}
