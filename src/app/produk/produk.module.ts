import { Module } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { ProdukController } from './produk.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from './produk.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([Produk])],
  providers: [ProdukService],
  controllers: [ProdukController],
})
export class ProdukModule {}
 