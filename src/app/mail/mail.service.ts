/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendForgotPassword(email: string, name: string, userId: number, token: string) {
    // Ubah URL ke frontend (port 3010)
    const link = `http://localhost:3010/auth/reset-pw?user_id=${userId}&token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Lupa Password',
      template: './lupa_password', // Pastikan template tersedia di direktori 'templates'
      context: {
        name: name,
        link: link, // Kirim link reset password ke template
      },
    });
  }
}