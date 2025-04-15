import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/apk/apk.dto';
import { ApkService } from './apk.service';

@Controller("apk")
export class ApkController {
  constructor(private apkService: ApkService) {}
  @Post("register")
  async register(@Body() payload: RegisterDto) {
    return this.apkService.register(payload);
  }
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.apkService.login(payload);
  }
}