import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MykantinService } from './mykantin.service';
import { Item } from './mykantin.entity';
import { CreateItemDto } from './mykantin.dto';

@Controller('mykantin')
export class MykantinController {
    constructor(private readonly itemsService: MykantinService) {}

    @Get('Find')
    findAll() {
      return this.itemsService.findAll();
    }
  
    @Post('Create')
    create(@Body() item: Partial<CreateItemDto>) {
      return this.itemsService.create(item);
    }
  
    @Delete(':id')
    // http://localhost:3000/mykantin/:id
    // contoh: http://localhost:3000/mykantin/1
    delete(@Param('id') id: string) {
      return this.itemsService.delete(id);
    }
}
