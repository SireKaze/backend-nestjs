import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { BulkCreateKategoriDto, CreateKategoriDto, findAllKategori, UpdateKategoriDto } from './kategori.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { User } from '../auth/auth.entity';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-update_by.decorator';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
 
 
@UseGuards(JwtGuard) //  implementasikan global guard pada semua endpont kategori memerlukan authentikasi saat request
@Controller('kategori')
export class KategoriController {
  constructor(private kategoriService: KategoriService) {}
 
  @Post('create')
  async create(@Body() payload: CreateKategoriDto) {
    return this.kategoriService.create(payload);
  }
 
  @Get('list')
  async getAllCategory(@Pagination() query: findAllKategori) {  //gunakan custom decorator yang pernah kita buat
    return this.kategoriService.getAllCategory(query);
  }
  @Get(':id')
  async getDetailKategori(@Param('id') id: number) {
    return this.kategoriService.getDetailKategori(id);
  }
@Delete(':id')
async deleteKategori(@Param('id') id: number) {
  return this.kategoriService.deleteKategori(id);
}
@Post('create-bulk')
async createBulkKategori(@Body() payload: BulkCreateKategoriDto) {
  return this.kategoriService.bulkCreate(payload);
}

@Put(':id/update')
async updateKategori(
  @Param('id') id: number,
  @InjectUpdatedBy() payload: UpdateKategoriDto,
) {
  return this.kategoriService.updateKategori(id, payload);
}



}
 