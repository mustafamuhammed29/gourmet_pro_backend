import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './document.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Restaurant } from '../restaurants/restaurant.entity'; // <-- ١. استيراد كيان المطعم

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Restaurant]), // <-- ٢. إضافة المطعم هنا
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService], // <-- ٤. تصدير الخدمة لتكون قابلة للاستخدام في الوحدات الأخرى
})
export class DocumentsModule {}
