import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Document } from './document.entity';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Restaurant } from '../restaurants/restaurant.entity'; // ١. استيراد كيان المطعم

@Module({
  imports: [
    // ٢. تسجيل الكيانات التي تحتاجها هذه الوحدة للوصول لقاعدة البيانات
    TypeOrmModule.forFeature([Document, Restaurant]),
    // ٣. تسجيل وتكوين Multer لمعالجة رفع الملفات
    MulterModule.register({
      storage: diskStorage({
        // ٤. تحديد مجلد حفظ الملفات
        destination: './uploads',
        // ٥. إنشاء اسم فريد لكل ملف يتم رفعه
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule { }

