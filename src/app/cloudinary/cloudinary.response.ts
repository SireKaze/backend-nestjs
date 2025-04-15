import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
 
export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
export interface CloudinaryDeleteResponse {
    success: boolean;
    message: string;
    result?: string;
    public_id?: string;
    secure_url?: string;
    [key: string]: any; // Allow additional properties
  }