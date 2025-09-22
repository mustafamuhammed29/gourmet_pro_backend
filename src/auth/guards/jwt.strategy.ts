import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// هذا الملف يحتوي على المنطق الفعلي للتحقق من صحة "بطاقة الهوية الرقمية"
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // ١. تحديد كيفية استخراج البطاقة من الطلب (من ترويسة Authorization)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // ٢. التأكد من أن البطاقة لم تنته صلاحيتها
            // ٣. استخدام نفس المفتاح السري الذي استخدمناه لإنشاء البطاقة
            secretOrKey: 'YOUR_SUPER_SECRET_KEY_GOES_HERE',
        });
    }

    // ٤. بعد التحقق من صحة البطاقة، هذه الدالة تقوم باستخراج محتواها
    async validate(payload: any) {
        // ٥. يمكننا الآن إرجاع بيانات المستخدم لتكون متاحة في أي جزء من التطبيق
        return { userId: payload.sub, email: payload.email };
    }
}
