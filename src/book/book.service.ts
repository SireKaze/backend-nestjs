import { HttpException, HttpStatus, Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Between, Like, Repository } from 'typeorm';
import { title } from 'process';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import BaseResponse from 'src/utils/response.utils';
import { createBookArrayDto, CreateBookDto, FindBookDto, UpdateBookDto } from './book.dto';
import { query } from 'express';
import { count } from 'console';


@Injectable()
export class BookService extends BaseResponse {

    constructor(@InjectRepository(Book) private readonly bookRepository: Repository<Book>
    ) {
        super();
    }

    //disini kita akan membuat api untuk mengakses semua data di tabel book

    async findAllBook(query: FindBookDto): Promise<ResponsePagination> {

        console.log('query', query)

        const { page,
            pageSize,
            limit,
            tittle,
            author,
            deskripsi,
            from_year,
            to_year,
            keyword,
        } = query


        const filter: {
            [key: string]: any;
        } = {};

        const search: {
            [key: string]: any;
        }[] = [];



        if (keyword) {
            search.push({
                title: Like(`%${keyword}%`),
            },
            {
                author: Like(`%${keyword}%`),
            },
            {
                deskripsi: Like(`%${keyword}%`),
            },
            {
                year : Like(`%${keyword}%`),
            },);
        } else {

            if (tittle) {
                filter.title = Like(`%${tittle}%`);
            }

            if (author) {
                filter.author = Like(`%${author}%`);
            }

            if (deskripsi) {
                filter.deskripsi = Like(`%${deskripsi}%`);
            }

            if (from_year && to_year) {
                filter.year = Between(from_year, to_year);
            }

            if (from_year && !!to_year === false) {
                filter.year = Between(from_year, from_year);
            }
        }


        console.log(page, pageSize)

        console.log('filter',filter)

        console.log('seracat',search)

        const result = await this.bookRepository.find({
            where: keyword ? search : filter,
            skip: limit,
            take: Number(pageSize)
        });

        const total = await this.bookRepository.count({
            where: keyword ? search : filter,
        });

        return this._pagination('ok', result, total, page, pageSize);

    }

    //MENAMBAH DATA

// Di service.ts
async add(payload: CreateBookDto): Promise<ResponseSuccess> {
    try {
      const save = await this.bookRepository.save(payload);
      return {
        statusCode: HttpStatus.CREATED,
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: save // Tambahkan data yang disimpan
      };
    } catch (err) {
      throw new HttpException(
        { status: 'error', message: 'Gagal menambahkan buku' },
        HttpStatus.BAD_REQUEST
      );
    }
  }


    // DETAIL DATA

    async detail(id: Number): Promise<ResponseSuccess> {


        const detail = await this.bookRepository.findOne({ where: { id: id } });

        if (detail === null) {
            throw new NotFoundException('book nout found,plis try again');
        }

        return this._succes('ok');
    }

    //   UPDATE DATA

    async update(id: number, payload: UpdateBookDto): Promise<ResponseSuccess> {

        // try {
        //     const result  = await this.bookRepository.save({
        //         title : payload.title,
        //         author : payload.author,
        //         decription : payload.deskripsi,
        //         id:id,
        //     });

        const result = await this.bookRepository.update(
            { id: id },
            {
                title: payload.title,
                author: payload.author,
                deskripsi: payload.deskripsi,
                year: payload.year,
            },
        );

        return this._succes('ok');

    } catch(err) {
        throw new HttpException("something went wrong", HttpStatus.BAD_REQUEST)
    }

    // UNTUK MENGHAPUS DATA

    async delete(id: number): Promise<ResponseSuccess> {

        const deleted = await this.bookRepository.delete(id);

        if (deleted.affected === 0) {
            throw new HttpException('data sudah tidak ada', HttpStatus.NOT_FOUND);
        }


        return this._succes('ok');

    }

    // UNTUK MENGHAPUS DATA LEBIH DARI 1
    async deleteMulti(ids: string[]): Promise<ResponseSuccess> {
        if (!ids || ids.length === 0) {
          throw new HttpException('Tidak ada data yang dikirim', HttpStatus.BAD_REQUEST);
        }
      
        const deleteResult = await this.bookRepository.delete(ids);
      
        if (deleteResult.affected === 0) {
          throw new HttpException('Data tidak ditemukan', HttpStatus.NOT_FOUND);
        }
      
        return this._succes('Berhasil menghapus data');
      }
      
    async bulkCreate(payload: createBookArrayDto): Promise<ResponseSuccess> {
        try {
          let berhasil = 0;
          let gagal = 0;
          await Promise.all(
            payload.data.map(async (data) => {
              try {
                await this.bookRepository.save(data);
    
                berhasil += 1;
              } catch {
                gagal += 1;
              }
            }),
          );
    
          return this._succes(`Berhasil menyimpan ${berhasil} dan gagal ${gagal}`);
        } catch {
          throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
        }
      }
    
}

