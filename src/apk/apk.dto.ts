import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsEmail, IsInt, IsString, Length, MinLength } from "class-validator";


export class apkDto {
  @IsInt()
  id: number;

  @IsString()
  nama: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  refresh_token: string;

  @IsString()
  role: string;
}

export class LoginDto extends PickType(apkDto, ['email', 'password']) {}

export class RegisterDto extends PickType(apkDto, [
  "nama",
  "email",
  "password",
]) {}