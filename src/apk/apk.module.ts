import { Module } from '@nestjs/common';
import { ApkController } from './apk.controller';
import { ApkService } from './apk.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { apk } from './apk.entity';

@Module({
  imports: [TypeOrmModule.forFeature([apk]),JwtModule.register({})],  // Pastikan diimpor'
  controllers : [ApkController],
  providers: [ApkService, JwtService],
})
export class ApkModule {}
