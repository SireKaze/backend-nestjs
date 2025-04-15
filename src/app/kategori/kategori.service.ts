import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response.utils';
import { Kategori } from './kategori.entity';
import { BulkCreateKategoriDto, CreateKategoriDto, findAllKategori, UpdateKategoriDto } from './kategori.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response.interface';
import { Like, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { User } from '../auth/auth.entity';

@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @Inject(REQUEST) private req: any,  // inject request agar bisa mengakses req.user.id dari  JWT token pada service
  ) {
    super();
  }
 
  async create(payload: CreateKategoriDto): Promise<ResponseSuccess> {
    try {
      await this.kategoriRepository.save({
        ...payload,
        created_by: {
          id: this.req.user.id,
        },
      });
 
      return this._succes('OK', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
 
  async getAllCategory(query: findAllKategori): Promise<ResponsePagination> {
    const { page = 1, pageSize = 10, nama_kategori = '', is_me = 0 } = query; // Tambahkan is_me dengan default 0
    const filterQuery: any = {};
  
    // Filter berdasarkan nama_kategori jika ada
    if (nama_kategori) {
      filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
    }
  
    // Tambahkan filter untuk kategori yang dibuat oleh user login jika is_me diaktifkan
    if (is_me === 1) {
      filterQuery.created_by = { id: this.req.user.id };
    }
  
    // Hitung total data dengan filter
    const total = await this.kategoriRepository.count({
      where: filterQuery,
    });
  
    // Ambil data kategori dengan filter
    const result = await this.kategoriRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by'], // relasi yang akan ditampilkan
      select: {
        id: true,
        nama_kategori: true,
        created_by: {
          id: true,
          nama: true,
          email: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  
    return this._pagination('OK', result, total, page, pageSize);
  }
  
  async getDetailKategori(id: number): Promise<ResponseSuccess> {
    try {
      const kategori = await this.kategoriRepository.findOne({
        where: { id },
        relations: ['created_by', 'updated_by'], // relasi yang akan ditampilkan
        select: {   // pilih data yang akan ditampilkan
          id: true,
          nama_kategori: true,
          created_by: {
            id: true,
            nama: true,
          },
          updated_by: {
            id: true,
            nama: true,
          },
        },
      });
  
      if (!kategori) {
        throw new HttpException('Kategori tidak ditemukan', HttpStatus.NOT_FOUND);
      }
  
      return this._succes('OK', kategori);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  async update(id: number, payload: UpdateKategoriDto, updatedBy: User): Promise<ResponseSuccess> {
    try {
      const kategori = await this.kategoriRepository.findOne({ where: { id } });

      if (!kategori) {
        throw new HttpException('Kategori tidak ditemukan', HttpStatus.NOT_FOUND);
      }

      // Update kategori dengan data baru
      Object.assign(kategori, payload);
      kategori.updated_by = updatedBy; // Assign the updatedBy object instead of just the id

      await this.kategoriRepository.save(kategori);

      return this._succes('Kategori berhasil diperbarui', kategori);
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  async deleteKategori(id: number): Promise<ResponseSuccess> {
    try {
      const kategori = await this.kategoriRepository.findOne({ where: { id } });
  
      if (!kategori) {
        throw new HttpException('Kategori tidak ditemukan', HttpStatus.NOT_FOUND);
      }
  
      await this.kategoriRepository.remove(kategori);
  
      return this._succes('Kategori berhasil dihapus', kategori);
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
async bulkCreate(payload: BulkCreateKategoriDto): Promise<ResponseSuccess> {
  try {
    let berhasil = 0;
    let gagal = 0;
    const createdBy = { id: this.req.user.id };

    const result = await Promise.all(
      payload.data.map(async (data) => {
        try {
          const kategori = await this.kategoriRepository.save({
            ...data,
            created_by: createdBy,
          });
          berhasil += 1;
          return kategori;
        } catch (error) {
          gagal += 1;
          return null;
        }
      }),
    );

    const insertedData = result.filter((item) => item !== null);

    return this._succes(`Berhasil menyimpan ${berhasil} kategori dan gagal ${gagal} kategori.`, insertedData);
  } catch (error) {
    throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
  }
}

  async updateKategori(id: number, payload: UpdateKategoriDto): Promise<ResponseSuccess> {
    try {
      const kategori = await this.kategoriRepository.findOne({ where: { id } });
  
      if (!kategori) {
        throw new HttpException('Kategori tidak ditemukan', HttpStatus.NOT_FOUND);
      }
  
      Object.assign(kategori, payload);
  
      await this.kategoriRepository.save(kategori);
  
      return this._succes('Kategori berhasil diperbarui', kategori);
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  
  

}

