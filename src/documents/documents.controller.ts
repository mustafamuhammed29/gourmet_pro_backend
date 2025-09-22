import {
    Controller,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    Req,
    UnauthorizedException,
    BadRequestException, // ١. تم استيراد أداة لإرسال أخطاء الطلبات السيئة
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('restaurants/me/documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'license', maxCount: 1 },
            { name: 'commercial_registry', maxCount: 1 },
        ]),
    )
    async uploadKybDocuments(
        @UploadedFiles() files: { license?: Express.Multer.File[], commercial_registry?: Express.Multer.File[] },
        @Req() req: Request,
    ) {
        if (!req.user) {
            throw new UnauthorizedException();
        }

        const user = req.user;
        console.log('Request received from authenticated user:', user);

        const licenseFile = files.license?.[0];
        const commercialRegistryFile = files.commercial_registry?.[0];

        // ٢. تمت إضافة هذا التحقق للتأكد من وجود الملفات
        if (!licenseFile || !commercialRegistryFile) {
            throw new BadRequestException('الرجاء التأكد من رفع جميع المستندات المطلوبة.');
        }

        // ٣. الآن TypeScript متأكد من أن الملفات موجودة
        return this.documentsService.uploadKybDocuments(
            user.userId,
            licenseFile,
            commercialRegistryFile,
        );
    }
}

