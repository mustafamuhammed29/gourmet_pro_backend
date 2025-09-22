import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// هذا الملف هو "الحارس الأمني" الفعلي الذي سنضعه أمام المسارات المحمية.
// هو ببساطة يستخدم الاستراتيجية التي بنيناها في الملف السابق.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
