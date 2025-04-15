import { Optional } from "@nestjs/common";
import { OmitType } from "@nestjs/mapped-types"
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, isNotEmpty, IsOptional, Length, Max, Min, MinLength, ValidateNested } from "class-validator"

export class BookDto{

    @IsOptional()
    id: number;

    @IsNotEmpty({message: 'tittle tidak boleh kosong'})
    @Length(5,100 ,{message: 'minim lima karakter'})
    title:string;


    @IsNotEmpty({message:'penulis tidak di temukan'})
    author:string;


    @IsInt()
    @Min(2020)
    @Max(2024)
    year:number;


    @IsOptional()
    deskripsi?:string;
}
export class createBookArrayDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateBookDto)
    data: CreateBookDto[];
  }

export class CreateBookDto extends OmitType(BookDto,["id"]){}
export class UpdateBookDto extends BookDto {}

export class FindBookDto{
    @IsInt()
    @Type(()=> Number)
    page = 1;


    @IsInt()
    @Type(()=> Number)
    pageSize = 10;

    @IsOptional()
    @IsInt()
    limit:number

    @IsOptional()
    tittle:string

    @IsOptional()
    author:string

    @IsOptional()
    deskripsi:string

    @IsOptional()
    @IsInt()
    @Type(()=> Number)
    from_year:number

    @IsOptional()
    @IsInt()
    @Type(()=> Number)
    to_year:number

    @IsOptional()
    keyword:string


}

[
    {
        tittle: "fantasy",
        year : 2021
    },
    {
        author: "nayaka"
    },
    {
        deskripsi : "perpus"
    },   
]
