import { Body, Controller , Get, Param , Post, Put, Query , Delete } from '@nestjs/common';
import { TugasService  } from './tugas.service';
import { get } from 'http';
import { query } from 'express';

@Controller('tugas')
export class TugasController {

    constructor(
        private readonly TugasService : TugasService
       ){}

   @Get('list') 
   TugasA(){
    return this.TugasService.tugas()
   } 
   
   
   @Get('detail/:id')
   detail(@Param('id') id : string){
       return this.TugasService.tugas2(id)
   }

  @Post("simpan")
  update(@Body() payload:any) {
    return this.TugasService.tugas3(payload)
  }
  

  @Delete('delete/:id')
  tugasD(@Param('id') id : string){
      return this.TugasService.tugas4(id)
  }
  
}


