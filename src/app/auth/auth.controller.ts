/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto, ResetPasswordDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtGuardRefreshToken } from './auth.guard';

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("register")
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  
  @Post("login")
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.authService.refreshToken(+id, token);
  }


  @Post('lupa-password')
  async forgotPassowrd(@Body('email') email: string) {
    console.log('email', email);
    return  this.authService.forgotPassword(email);
  }

  @Post('reset-password/:user_id')  // url yang dibuat pada endpont harus sama dengan ketika kita membuat link pada service forgotPassword
  async ResetPassword(
    @Param('user_id') user_id: string,
    @Body() payload: ResetPasswordDto,
    @Body() token: string
  ) {
    return this.authService.ResetPassword(+user_id, token, payload);
  }
}
