import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { SiswaService } from './siswa.service';
import { SiswaDto } from './siswa.dto';

@Controller('siswa')
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) {}

  @Get('list')
  findAll() {
    return this.siswaService.findAll();
  }

  @Post('create')
  create(@Body() createSiswaDto: SiswaDto) {
    return this.siswaService.create(createSiswaDto);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateSiswaDto: SiswaDto) {
    return this.siswaService.update(+id, updateSiswaDto);
  }

  @Get('detail/:id')
  detail(@Param('id') id: string) {
    return this.siswaService.find(+id);
  }
}