import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatihanModule } from './latihan/latihan.module';
import { TugasModule } from './tugas/tugas.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiswaModule } from './PTS/siswa.module';
import { AuthModule } from './app/auth/auth.module';
import { ApkModule } from './apk/apk.module';
import { MailModule } from './app/mail/mail.module';
import { AuthGuard } from '@nestjs/passport';
import { KategoriModule } from './app/kategori/kategori.module';
import { BookModule } from './book/book.module'; // Import BookModule
import { MykantinModule } from './mykantin/mykantin.module';
import { ProdukModule } from './app/produk/produk.module';
import { UploadController } from './app/upload/upload.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CloudinaryModule } from './app/cloudinary/cloudinary.module';

@Module({
  imports: [ConfigModule.forRoot({ 
    isGlobal: true
  }),
  
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const { typeOrm } = await import('./config/typeorm.config');
        return typeOrm;
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: 'public',
    }),
    LatihanModule, TugasModule, SiswaModule, AuthModule, ApkModule, MailModule, KategoriModule, BookModule, MykantinModule, ProdukModule, CloudinaryModule, // Add BookModule
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule { }


