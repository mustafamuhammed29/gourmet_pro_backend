import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  // --- ✨ تم تصحيح اسم الدالة وتحسينها ---
  async handleUpload(userId: string, files: Array<Express.Multer.File>) {
    // ١. البحث عن المستخدم للعثور على مطعمه
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['restaurant'],
    });

    if (!user || !user.restaurant) {
      throw new NotFoundException('لم يتم العثور على المطعم المرتبط بهذا الحساب.');
    }

    // ٢. استدعاء الدالة الداخلية لحفظ الملفات
    return this.saveUploadedDocuments(user.restaurant, files);
  }

  // هذه الدالة الداخلية يمكن إعادة استخدامها في أماكن أخرى (مثل عملية التسجيل)
  async saveUploadedDocuments(
    restaurant: Restaurant,
    files: Array<Express.Multer.File>,
  ) {
    const documentPromises = files.map((file) => {
      // منطق ذكي لتحديد نوع المستند من اسمه
      const documentType = file.originalname.toLowerCase().includes('license')
        ? 'license'
        : 'commercial_registry';

      const newDocument = this.documentsRepository.create({
        filePath: file.path,
        type: documentType,
        restaurant: restaurant,
      });
      return this.documentsRepository.save(newDocument);
    });

    await Promise.all(documentPromises);

    return { message: 'تم رفع المستندات بنجاح!' };
  }
}

