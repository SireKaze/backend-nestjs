import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class ProdukDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  barcode: string;

  @IsString()
  @IsNotEmpty()
  nama_produk: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  kategori_id: number;

  @IsString()
  @IsNotEmpty()
  deskripsi_produk: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  harga: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  stok: number;

  @IsOptional()
  @IsString()
  foto: string;
}

export class CreateProdukDto extends OmitType(ProdukDto, ['id']) {}

export class CreateProdukArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProdukDto)
  data: CreateProdukDto[];
}

export class findAllProduk extends PageRequestDto {
  @IsOptional()
  @IsString()
  nama_produk: string;

  @IsOptional()
  @IsString()
  deskripsi_produk: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  dari_harga: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sampai_harga: number;

  @IsOptional()
  @IsString()
  keyword: string;

  @IsOptional()
  @IsString()
  nama_kategori: string; // Latihan 5: Tambahkan parameter pencarian kategori
}

export class UpdateProdukDto {
  @IsOptional()
  @IsString()
  nama_produk?: string;

  @IsOptional()
  @IsString()
  deskripsi_produk?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  harga?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  stok?: number;
}

export class DeleteBulkDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}
export class CreateBulkProdukDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProdukDto)
    produk: CreateProdukDto[];
}