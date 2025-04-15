import { Controller, Get , Post  , Put , Delete , Patch } from '@nestjs/common';
import { AppService } from './app.service';
import { ok } from 'assert';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Put()
  update1() : string {
    return 'ini method update'
  }


  @Put('cek')
  update() : string {
    return 'ok'
  }

  @Get()
  getHello(): string {
    return 'belajar routing nestjs';
  }

  @Get('list')
  getHello2(): string {
    return 'belajar routing nestjs 2';
  }

  @Post()
  cetak1() : string{
    return 'ok'
  }

  
  @Post('tes')
  cetak2() : string{
    return 'ok tes'
  }

}
