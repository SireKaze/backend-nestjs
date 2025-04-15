import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { CreateProdukArrayDto, findAllProduk, UpdateProdukDto, DeleteBulkDto } from './produk.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@UseGuards(JwtGuard)
@Controller('produk')
export class ProdukController {
  constructor(private produkService: ProdukService) {}

  @Post('create-bulk')
  async createBulk(@Body() payload: CreateProdukArrayDto) {
    return this.produkService.createBulk(payload);
  }

  @Get('list')
  async findAll(@Pagination() query: findAllProduk) {
    return this.produkService.findAll(query);
  }

  // Latihan 1: Detail Produk
  @Get(':id')
  async getDetail(@Param('id') id: number) {
    return this.produkService.getDetail(id);
  }

  // Latihan 2: Update Produk
  @Put(':id')
  async updateProduk(@Param('id') id: number, @Body() payload: UpdateProdukDto) {
    return this.produkService.updateProduk(id, payload);
  }

  // Latihan 3: Delete Produk
  @Delete(':id')
  async deleteProduk(@Param('id') id: number) {
    return this.produkService.deleteProduk(id);
  }

  // Latihan 4: Delete Bulk Produk
  @Post('delete-bulk')
  async deleteBulkProduk(@Body() payload: DeleteBulkDto) {
    return this.produkService.deleteBulkProduk(payload);
  }
}
