import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './mykantin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MykantinService {
    constructor(
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
      ) {}
    
      async findAll(): Promise<Item[]> {
        return this.itemsRepository.find();
      }
    
      async create(item: Partial<Item>): Promise<Item> {
        const newItem = this.itemsRepository.create(item);
        return this.itemsRepository.save(newItem);
      }
    
      async delete(@Param('id') id: string): Promise<void> {
        await this.itemsRepository.delete(id);
      }
}


