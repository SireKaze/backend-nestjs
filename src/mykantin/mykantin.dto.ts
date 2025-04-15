import { IsOptional } from "class-validator";


export class CreateItemDto {
    @IsOptional()
    name: string;

    @IsOptional()
    price: string;

    @IsOptional()
    imageUrl: string;

    @IsOptional()
    rating: string;
  }