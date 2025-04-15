import { Module } from '@nestjs/common';
import { SiswaService } from './siswa.service';
import { SiswaController } from './siswa.controller';
import { Siswa } from './siswa.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports : [TypeOrmModule.forFeature([Siswa])],
  providers: [SiswaService],
  controllers: [SiswaController]
})
export class SiswaModule {}