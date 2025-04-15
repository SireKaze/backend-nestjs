import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResponseSuccess } from 'src/interface/response.interface';
import * as fs from 'fs';
import BaseResponse from 'src/utils/response.utils';
import { JwtGuard } from '../auth/auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@UseGuards(JwtGuard)
@Controller('upload')
export class UploadController extends BaseResponse {
  constructor(private readonly cloudinaryService: CloudinaryService) {
    super();
  }

  @Delete(':publicId')
  async deleteCloudinaryAsset(@Param('publicId') publicId: string) {
    return this.cloudinaryService.deleteAsset(publicId);
  }
  // =======================================================
  // Latihan 1: Single file (image dan PDF)
  // =======================================================
  @Post('single/image-pdf')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${new Date().getTime()}.${fileExtension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              'Hanya file gambar dan PDF yang diperbolehkan',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadSingleImagePdf(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseSuccess> {
    if (!file) {
      throw new HttpException('File wajib diupload', HttpStatus.BAD_REQUEST);
    }
    const url = `${process.env.BASE_SERVER_URL}/uploads/${file.filename}`;
    return this._succes('File berhasil diupload', {
      file: {
        file_url: url,
        file_name: file.filename,
        file_size: file.size,
      },
    });
  }

  // =======================================================
  // Latihan 2: Single file dengan validasi ukuran file (<2MB)
  // =======================================================
  @Post('single/file-size')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${new Date().getTime()}.${fileExtension}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  async uploadSingleFileSize(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseSuccess> {
    if (!file) {
      throw new HttpException(
        'File wajib diupload atau ukuran file melebihi batas 2MB',
        HttpStatus.BAD_REQUEST,
      );
    }
    const url = `${process.env.BASE_SERVER_URL}/uploads/${file.filename}`;
    return this._succes('File berhasil diupload', {
      file: {
        file_url: url,
        file_name: file.filename,
        file_size: file.size,
      },
    });
  }

  // =======================================================
  // Latihan 3: Multiple file (image dan PDF)
  // =======================================================
  @Post('multiple/image-pdf')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${new Date().getTime()}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              'Hanya file gambar dan PDF yang diperbolehkan',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadMultipleImagePdf(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ResponseSuccess> {
    if (!files || files.length === 0) {
      throw new HttpException('Minimal 2 File wajib diupload', HttpStatus.BAD_REQUEST);
    }
    const fileResponse = files.map((file) => ({
      file_url: `${process.env.BASE_SERVER_URL}/uploads/${file.filename}`,
      file_name: file.filename,
      file_size: file.size,
    }));
    return this._succes('Files berhasil diupload', {
      files: fileResponse,
    });
  }

  // =======================================================
  // Latihan 4: Multiple file dengan validasi ukuran file (<2MB per file)
  // =======================================================
  @Post('multiple/file-size')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${new Date().getTime()}-${file.originalname}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB per file
    }),
  )
  async uploadMultipleFileSize(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ResponseSuccess> {
    if (!files || files.length === 0) {
      throw new HttpException(
        'Minimal 2 File wajib diupload atau terdapat file yang melebihi ukuran 2MB',
        HttpStatus.BAD_REQUEST,
      );
    }
    const fileResponse = files.map((file) => ({
      file_url: `${process.env.BASE_SERVER_URL}/uploads/${file.filename}`,
      file_name: file.filename,
      file_size: file.size,
    }));
    return this._succes('Files berhasil diupload', {
      files: fileResponse,
    });
  }

  // =======================================================
  // Endpoint yang sudah ada (tanpa validasi tambahan)
  // =======================================================
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${new Date().getTime()}.${fileExtension}`);
        },
      }),
    }),
  )
  @Post('files')
  async uploadFileMulti(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ResponseSuccess> {
    try {
      const fileResponse: Array<{
        file_url: string;
        file_name: string;
        file_size: number;
      }> = [];
 
      files.forEach((file) => {
        const url = `${process.env.BASE_SERVER_URL}/uploads/${file.filename}`;
        fileResponse.push({
          file_url: url,
          file_name: file.filename,
          file_size: file.size,
        });
      });
 
      return this._succes('OK', {
        file: fileResponse,
      });
    } catch (err) {
      throw new HttpException('Terjadi kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('file/delete/:filename')
  async DeleteFile(
    @Param('filename') filename: string,
  ): Promise<ResponseSuccess> {
    try {
      const filePath = `public/uploads/${filename}`;
      fs.unlinkSync(filePath);
      return this._succes('Berhasil menghapus file');
    } catch (err) {
      throw new HttpException('File tidak ditemukan', HttpStatus.NOT_FOUND);
    }
  }

  @Post('cloudinary')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }


}


