import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

// هذا الكلاس هو المسؤول الوحيد عن التحدث مباشرة مع جدول "users"
@Injectable()
export class UsersService {
    [x: string]: any;
    constructor(
        // حقن مستودع TypeORM الخاص بكيان User
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    // دالة للبحث عن مستخدم عن طريق البريد الإلكتروني
    // تم تعديل نوع الإرجاع ليقبل "null" وهو ما يتوافق مع TypeORM
    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    // دالة لإنشاء مستخدم جديد في قاعدة البيانات
    async create(userData: Partial<User>): Promise<User> {
        const newUser = this.usersRepository.create(userData);
        return this.usersRepository.save(newUser);
    }
}

