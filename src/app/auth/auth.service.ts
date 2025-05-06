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
    private readonly jwtService: JwtService,
    private readonly mailService: MailService, // Correct the name here
  ) {
    super()
    
    ;}

  generateJWT(payload: JwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
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

  async forgotPassword(email: string): Promise<any> {
    const user = await this.authRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('Email tidak ditemukan', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // Generate access token dengan masa berlaku 5 menit
    const token = this.generateJWT(
      { id: user.id, email: user.email },
      '5m', // Masa berlaku 5 menit
      process.env.ACCESS_TOKEN_SECRET,
    );

    const link = `http://localhost:3010/auth/reset-pw/${user.id}/${token}`;

    await this.mailService.sendForgotPassword(user.email, user.nama, user.id, token);

    return { message: 'Silahkan cek email Anda untuk reset password' };
  }

  async ResetPassword(user_id: number, token: string, payload: ResetPasswordDto): Promise<any> {
    try {
      // Verifikasi token
      const decoded = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      // Pastikan token sesuai dengan user_id
      if (decoded.id !== user_id) {
        throw new HttpException('Token tidak valid', HttpStatus.UNPROCESSABLE_ENTITY);
      }

      // Hash password baru
      const hashedPassword = await hash(payload.new_password, 12);

      // Update password user
      await this.authRepository.update(
        { id: user_id },
        { password: hashedPassword },
      );

      return { message: 'Reset Password Berhasil, Silahkan login ulang' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException('Link reset password telah kadaluarsa', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Token tidak valid', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async social(payload:any): Promise<ResponseSuccess> {
    let checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checkUserExists) {
      checkUserExists = await this.authRepository.save(payload);
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      email: checkUserExists.email,
    };

    const access_token = this.generateJWT(
      jwtPayload,
      '30',
      process.env.ACCESS_TOKEN_SECRET,
    );

    const refresh_token = this.generateJWT(
      jwtPayload,
      '1d',
      process.env.REFRESH_TOKEN_SECRET,
    );

    await this.authRepository.update(
      {
        id: checkUserExists.id,
      },
      {
        refresh_token: refresh_token,
      },
    );

    return this._succes('Login Success', {
      ...checkUserExists,
      access_token,
      refresh_token,
    });
  }

  async gitsocial(payload:any): Promise<ResponseSuccess> {
    let checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checkUserExists) {
      checkUserExists = await this.authRepository.save(payload);
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      email: checkUserExists.email,
    };

    const access_token = this.generateJWT(
      jwtPayload,
      '30',
      process.env.ACCESS_TOKEN_SECRET,
    );

    const refresh_token = this.generateJWT(
      jwtPayload,
      '1d',
      process.env.REFRESH_TOKEN_SECRET,
    );

    await this.authRepository.update(
      {
        id: checkUserExists.id,
      },
      {
        refresh_token: refresh_token,
      },
    );

    return this._succes('Login Success', {
      ...checkUserExists,
      access_token,
      refresh_token,
    });
  }
}
