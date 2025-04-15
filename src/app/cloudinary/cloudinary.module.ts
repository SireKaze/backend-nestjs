import { Global, Module } from '@nestjs/common';
// import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
 
@Global()
@Module({
  
  providers: [CloudinaryService, CloudinaryProvider],
  exports : [CloudinaryService, CloudinaryProvider]
})
export class CloudinaryModule {}