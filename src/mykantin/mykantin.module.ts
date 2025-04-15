import { Module } from '@nestjs/common';
import { MykantinService } from './mykantin.service';
import { MykantinController } from './mykantin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './mykantin.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Item]),],
  controllers: [MykantinController],
  providers: [MykantinService],
})
export class MykantinModule {}
