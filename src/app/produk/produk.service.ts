import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response.utils';
import { Produk } from './produk.entity';
import { Between, Like, Repository, In } from 'typeorm';
import { CreateProdukArrayDto, findAllProduk, UpdateProdukDto, DeleteBulkDto } from './produk.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response.interface';

@Injectable()
export class ProdukService extends BaseResponse {
  constructor(
    @InjectRepository(Produk)
    private readonly produkRepository: Repository<Produk>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  

  async getDetail(id: number) {
    const produk = await this.produkRepository.findOne({
      where: { id },
      relations: ['kategori', 'created_by', 'updated_by'],
    });

    if (!produk) {
      throw new HttpException('Produk tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    return this._succes('Produk ditemukan', produk);
  }

  async createBulk(payload: CreateProdukArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (data) => {
          const dataSave = {
            ...data,
            kategori: {
              id: data.kategori_id,
            },
            created_by: {
              id: this.req.user.id,
            },
          };
 
          try {
            await this.produkRepository.save(dataSave);
 
            berhasil += 1;
          } catch (err) {
            console.log('err', err);
            gagal += 1;
          }
        }),
      );
 
      return this._succes(`Berhasil menyimpan ${berhasil} dan gagal ${gagal}`);
    } catch (err) {
      console.log('err', err);
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async updateProduk(id: number, payload: UpdateProdukDto): Promise<ResponseSuccess> {
    const produk = await this.produkRepository.findOne({ where: { id } });

    if (!produk) {
      throw new HttpException('Produk tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    await this.produkRepository.update(id, { ...payload, updated_by: { id: this.req.user.id } });

    return this._succes('Produk berhasil diperbarui');
  }

  async deleteProduk(id: number): Promise<ResponseSuccess> {
    const produk = await this.produkRepository.findOne({ where: { id } });

    if (!produk) {
      throw new HttpException('Produk tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    await this.produkRepository.delete(id);
    return this._succes('Produk berhasil dihapus');
  }

  async deleteBulkProduk(payload: DeleteBulkDto): Promise<ResponseSuccess> {
    const result = await this.produkRepository.delete({ id: In(payload.ids) });

    if (result.affected === 0) {
      throw new HttpException('Produk tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    return this._succes(`Berhasil menghapus ${payload.ids.length} produk`);
  }

  async findAll(query: findAllProduk): Promise<ResponsePagination> {
    const {
      page,
      pageSize,
      nama_produk,
      dari_harga,
      sampai_harga,
      deskripsi_produk,
      keyword,
      nama_kategori,
    } = query;

    const filterQuery: any = {};
    const filterKeyword = [];

    if (keyword) {
      filterKeyword.push(
        { nama_produk: Like(`%${keyword}%`) },
        { harga: Like(`%${keyword}%`) },
        { deskripsi_produk: Like(`%${keyword}%`) },
        { kategori: { nama_kategori: Like(`%${keyword}%`) } } // Latihan 6: Cari berdasarkan kategori
      );
    } else {
      if (deskripsi_produk) {
        filterQuery.deskripsi_produk = Like(`%${deskripsi_produk}%`);
      }
      if (nama_produk) {
        filterQuery.nama_produk = Like(`%${nama_produk}%`);
      }
      if (dari_harga && sampai_harga) {
        filterQuery.harga = Between(dari_harga, sampai_harga);
      }
      if (dari_harga && !sampai_harga) {
        filterQuery.harga = Between(dari_harga, dari_harga);
      }
      if (nama_kategori) {
        filterQuery.kategori = { nama_kategori: Like(`%${nama_kategori}%`) }; // Latihan 5
      }
    }

    const total = await this.produkRepository.count({
      where: keyword ? filterKeyword : filterQuery,
    });

    const result = await this.produkRepository.find({
      where: keyword ? filterKeyword : filterQuery,
      relations: ['created_by', 'updated_by', 'kategori'],
      select: {
        id: true,
        nama_produk: true,
        deskripsi_produk: true,
        stok: true,
        harga: true,
        kategori: {
          id: true,
          nama_kategori: true,
        },
        created_by: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
      },
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }
}
