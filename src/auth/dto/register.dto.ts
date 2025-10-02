import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'اسم المطعم مطلوب' })
    restaurantName: string;

    @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
    email: string;

    @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
    @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
    password: string;

    @IsNotEmpty({ message: 'العنوان مطلوب' })
    address: string;

    @IsNotEmpty({ message: 'نوع المطبخ مطلوب' })
    cuisineType: string;

    @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'الاسم الكامل مطلوب' })
    fullName: string;
}
