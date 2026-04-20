import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;
  private readonly bucketName: string;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    this.bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'institutes';
  }

  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      // 1. Process and convert to WebP
      const webpBuffer = await sharp(file.buffer)
        .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      // 2. Generate unique filename
      const fileName = `${folder}/${uuidv4()}.webp`;

      // 3. Upload to Supabase
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, webpBuffer, {
          contentType: 'image/webp',
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error(`Supabase upload error (Bucket: ${this.bucketName}):`, error);
        throw new InternalServerErrorException(`Failed to upload to storage: ${error.message}`);
      }

      // 4. Get Public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Image processing error:', error);
      throw new InternalServerErrorException('Image processing failed');
    }
  }
}
