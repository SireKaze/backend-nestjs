import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response.utils';
import { Repository } from 'typeorm';
import { apk } from './apk.entity';
import { LoginDto, RegisterDto } from './apk.dto';
import { ResponseSuccess } from 'src/interface';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class ApkService extends BaseResponse {
    constructor(
        @InjectRepository(apk) private readonly apkRepository: Repository<apk>,
        private jwtService: JwtService,
    ) {
        super()
    }


    generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
      return this.jwtService.sign(payload, {
        secret: token,
        expiresIn: expiresIn,
      });
    } //membuat method untuk generate jwt

    async register(payload: RegisterDto): Promise<ResponseSuccess> {
        //cek email sudah terdaftar

        const checkUserExists = await this.apkRepository.findOne({
            where: {
                email: payload.email,
            },
        });

        if (checkUserExists) {
            throw new HttpException("email sudah di gunakan", HttpStatus.FOUND);
          }

          //hash password
          payload.password = await hash(payload.password,12)
          //hash password
          await this.apkRepository.save(payload)
          return this._succes("register berhasil")
    }

    // login terdaftar
    async login(payload: LoginDto): Promise<ResponseSuccess> {
        const checkUserExists = await this.apkRepository.findOne({
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
          throw new HttpException(
            'User tidak ditemukan',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
    
        const checkPassword = await compare(
          payload.password,
          checkUserExists.password,
        ); // compare password yang dikirim dengan password yang ada di tabel
        if (checkPassword) {

          const jwtPayload : jwtPayload = {
            id : checkUserExists.id,
            nama : checkUserExists.nama,
            email : checkUserExists.email,
          };

          const acces_token = await this.generateJWT(
            jwtPayload,
            '1d',
            process.env.ACCES_TOKEN_SECRET,
          );
      
 


          return this._succes('Login Success', {...
            checkUserExists,acces_token});
            

        } else {
          throw new HttpException(
            'email dan password tidak sama',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }
}
