import { Body, Controller , Get, Param , Post, Put, Query} from '@nestjs/common';
import { query } from 'express';
import { LatihanService } from './latihan.service';

@Controller('latihan')
export class LatihanController {

    constructor(
     private readonly LatihanService : LatihanService
    ){}

    @Get()
    findAll(@Query() query:any){
        return this.LatihanService.findAll(query)
    }

    @Get('detail/:id/:nama')
    detail(@Param('id') id : string, @Param('nama') name : string){
        return this.LatihanService.findDetail(id,name)
    }

    @Post("simpan")
    register(@Body() payload:any){
        return {
            method : 'get',
            payload : payload
        }
    }

@Put("update/:id")
  update(@Param('id') id: string, @Body() payload:any) {
    return this.LatihanService.register(payload)
  }
}


//buatlah request method put seperti url berikut
//https:localhost : 4000 /latihan/update/1
//dan berikan 


