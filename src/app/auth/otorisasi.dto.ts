import { IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @MinLength(8)
    new_password: string;

    @IsString()
    @MinLength(6)
    token: string;
  }