/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response.utils';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './auth.dto';
import { ResponseSuccess } from 'src/interface';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './../../../node_modules/@types/jsonwebtoken/index.d';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';
import { ResetPassword } from './reset_password.entity';
import { ResetPasswordDto } from './otorisasi.dto';
import { Token } from 'nodemailer/lib/xoauth2';

@Injectable()
export class AuthService extends BaseResponse {
  
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private JwtService: JwtService,
    private mailService: MailService,
  ) {
    super();
  }

  generateJWT(payload: JwtPayload, expiresIn: string | number, token: string) {
    return this.JwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  } //membuat method untuk generate jwt

  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    //cek dahulu email tersebut sudah ada atau belum

    const ChekUserExist = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (ChekUserExist) {
      throw new HttpException('email sudah digunakan', HttpStatus.FOUND);
    }

    //has password
    payload.password = await hash(payload.password, 12);
    //has password

    await this.authRepository.save(payload);
    return this._succes('register Berhasil');
  }

  //membuat refresh token
  async refreshToken(id: number, token: string): Promise<ResponseSuccess> {
    const CheckLogin = await this.authRepository.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    console.log('user', CheckLogin);
    if (CheckLogin === null) {
      throw new UnauthorizedException();
    }

    const JwtPayload: jwtPayload = {
      id: CheckLogin.id,
      nama: CheckLogin.nama,
      email: CheckLogin.email,
    };

    const access_token = this.generateJWT(
      JwtPayload,
      30,
      process.env.ACCESS_TOKEN_SECRET,
    );

    const refreshToken = this.generateJWT(
      JwtPayload,
      '1d',
      process.env.REFRESH_TOKEN_SECRET,
    );
    await this.authRepository.update(
      {
        id: CheckLogin.id,
      },
      {
        refresh_token: refreshToken,
      },
    );

    return this._succes('Success', {
      ...CheckLogin,
      access_token: access_token,
      refresh_token: refreshToken,
    });
  }

  //login
  async login(payload: LoginDto): Promise<ResponseSuccess> {
    const CheckLogin = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
        role: true,
      },
    });
    if (!CheckLogin) {
      throw new HttpException(
        'User Tidak di temukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const CheckPassword = await compare(payload.password, CheckLogin.password); // compare password yang dikirim dengan password yang ada di tabel
    if (CheckPassword) {
      const JwtPayload: JwtPayload = {
        id: CheckLogin.id,
        nama: CheckLogin.nama,
        email: CheckLogin.email,
      };
      console.log('login:' , CheckLogin);
      const access_token = this.generateJWT(
        JwtPayload,
        '1d',
        process.env.ACCESS_TOKEN_SECRET,
      );

      const refreshToken = this.generateJWT(
        JwtPayload,
        '1d',
        process.env.REFRESH_TOKEN_SECRET,
      );
      await this.authRepository.update(
        {
          id: CheckLogin.id,
        },
        {
          refresh_token: refreshToken,
        },
      );

      return this._succes('Login Succes', {
        ...CheckLogin,
        access_token,
        refreshToken,
      });
    } else {
      throw new HttpException(
        'email dan Password Tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async forgotPassword(email: string): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Email tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const token = Math.floor(Math.random() * 1000000).toString();
        const link = `http://localhost:5002/auth/reset-password/${user.id}/${token}`; //membuat link untuk reset password
    console.log(link);
    // await this.mailService.sendForgotPassword({
    //   email: email,
    //   name: user.nama,
    //   link: link,
    // });

    const payload = {
      user: {
        id: user.id,
      },
      token: token,
    };

    await this.resetPasswordRepository.save(payload); // menyimpan token dan id ke tabel reset password

    return this._succes('Silahkan Cek Email',{token});
  }

  async ResetPassword(
    user_id: number,
    token: string,
    payload: ResetPasswordDto,
  ): Promise<ResponseSuccess> {
    const userToken = await this.resetPasswordRepository.findOne({
      //cek apakah user_id dan token yang sah pada tabel reset password
      where: {
        user: {
          id: user_id,
        },
      },
    });

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY, // jika tidak sah , berikan pesan token tidak valid
      );
    }

    payload.new_password = await hash(payload.new_password, 12); //hash password
    await this.authRepository.save({
      // ubah password lama dengan password baru
      password: payload.new_password,
      id: user_id,
      Token: payload.token
    });
    await this.resetPasswordRepository.delete({
      // hapus semua token pada tabel reset password yang mempunyai user_id yang dikirim, agar tidak bisa digunakan kembali
      user: {
        id: user_id,
      },
    });

    return this._succes('Reset Passwod Berhasil, Silahkan login ulang');
  }
}
