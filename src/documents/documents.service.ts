import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { Restaurant } from '../restaurants/restaurant.entity'; // استيراد كيان المطعم

@Injectable()
export class DocumentsService {
    constructor(
        // حقن مستودع المستندات للتحدث مع قاعدة البيانات
        @InjectRepository(Document)
        private documentsRepository: Repository<Document>,
        // حقن مستودع المطاعم للعثور على المطعم الصحيح
        @InjectRepository(Restaurant)
        private restaurantsRepository: Repository<Restaurant>,
    ) { }

    async uploadKybDocuments(
        userId: string, // سنستخدم هذا للعثور على المطعم
        licenseFile: Express.Multer.File,
        commercialRegistryFile: Express.Multer.File,
    ) {
        // ١. العثور على المطعم المرتبط بالمستخدم
        // ملاحظة: هذه العلاقة تحتاج إلى إعداد صحيح في كيان User
        const restaurant = await this.restaurantsRepository.findOne({ where: { owner: { id: userId } } });

        if (!restaurant) {
            throw new BadRequestException('لم يتم العثور على المطعم المرتبط بهذا المستخدم.');
        }

        // ٢. إنشاء وحفظ سجل مستند الرخصة في قاعدة البيانات
        const licenseDoc = this.documentsRepository.create({
            restaurant: restaurant,
            documentType: 'license',
            fileUrl: licenseFile.path, // ٣. حفظ مسار الملف الفعلي
            status: 'pending',
        });
        await this.documentsRepository.save(licenseDoc);

        // ٤. إنشاء وحفظ سجل مستند السجل التجاري
        const registryDoc = this.documentsRepository.create({
            restaurant: restaurant,
            documentType: 'commercial_registry',
            fileUrl: commercialRegistryFile.path,
            status: 'pending',
        });
        await this.documentsRepository.save(registryDoc);


        return {
            message: 'تم رفع المستندات بنجاح وهي الآن قيد المراجعة.',
            files: [
                { document_type: 'license', path: licenseFile.path },
                { document_type: 'commercial_registry', path: commercialRegistryFile.path },
            ],
        };
    }
}

