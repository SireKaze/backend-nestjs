import { Body, Controller , Delete, Get , HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { createBookArrayDto, CreateBookDto, FindBookDto, UpdateBookDto } from './book.dto';
import { query } from 'express';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { JwtGuard } from 'src/app/auth/auth.guard';
import { ResponseSuccess } from 'src/interface';

@Controller('book')
export class BookController {

    constructor(private bookService: BookService) {}

    @Get('list')
    async findAllBook(@Pagination() query:FindBookDto) {

        return this.bookService.findAllBook(query);
    }

    @Post('create')
    async createBook(@Body() payload : CreateBookDto){
        return this.bookService.add(payload)
    }

    @Get('detail/:id')
    async detail(@Param('id') id:number){
        return this.bookService.detail(+id)
    }
   
    @Put('update/:id')
    async updateBook(@Param('id') id : number, @Body() payload : UpdateBookDto){
        return this.bookService.update(id,payload)
    }

    @Delete('delete/:id')
    async deleteBook (@Param('id') id:number ){
        return this.bookService.delete(id)
    }

    @Delete('delete')
    async deleteMulti(@Query('id') id: string): Promise<ResponseSuccess> {
      if (!id) {
        throw new HttpException('Parameter id diperlukan', HttpStatus.BAD_REQUEST);
      }
    
      // Memisahkan id berdasarkan koma dan memfilter jika ada nilai kosong
      const idArray = id.split(',').filter(item => item.trim() !== '');
    
      if (idArray.length === 0) {
        throw new HttpException('Tidak ada ID yang valid untuk dihapus', HttpStatus.BAD_REQUEST);
      }
    
      return this.bookService.deleteMulti(idArray);
    }
    
    @Post('/create/bulk')
    bulkCreateBook(@Body() payload: createBookArrayDto) {
      return this.bookService.bulkCreate(payload);
    }
}
