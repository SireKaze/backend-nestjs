import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary, v2 } from 'cloudinary';
import { CloudinaryDeleteResponse, CloudinaryResponse } from './cloudinary.response';
const streamifier = require('streamifier');
 
@Injectable()
export class CloudinaryService {

  async deleteAsset(publicId: string): Promise<CloudinaryDeleteResponse> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        type: 'upload',
        invalidate: true,
      });
      return {
        success: true,
        message: 'Asset deleted successfully',
        ...result,
      };
    } catch (error) {
      throw new HttpException(
        `Error deleting asset: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve({
            
            file_url : result.secure_url,
            file_name : result.public_id + "." +result.format,
            file_size : result.byte,
            ...result});
        },
      );
 
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}