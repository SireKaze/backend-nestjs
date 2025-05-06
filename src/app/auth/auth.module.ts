/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { ResetPassword } from './reset_password.entity';
import { MailModule } from '../mail/mail.module'; // Import MailModule
import { UsedToken } from './auth.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, ResetPassword, UsedToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
    MailModule, // Add MailModule to imports
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}