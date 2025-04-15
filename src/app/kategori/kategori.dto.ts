import { OmitType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString, IsNumber, Min, Max, IsNotEmpty, ValidateNested } from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';
import { Type } from 'class-transformer';

export class KategoriDto {
  @IsInt()
  id?: number;

  @IsString()
  nama_kategori: string;
}

export class CreateKategoriDto extends OmitType(KategoriDto, ['id']) {}

export class findAllKategori extends PageRequestDto {
  @IsString()
  @IsOptional()
  nama_kategori: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  is_me?: number;
}

export class UpdateKategoriDto {
  @IsNotEmpty()
  nama_kategori: string;

  @IsOptional()
  updated_by?: { id: number };
}

export class BulkCreateKategoriDto {
  @ValidateNested({ each: true })
  @Type(() => CreateKategoriDto)
  data: CreateKategoriDto[];
}

