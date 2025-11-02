import { Injectable, NotFoundException } from '@nestjs/common'; // <-- ١. استيراد NotFoundException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Restaurant } from '../restaurants/restaurant.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: string): Promise<User | null> {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne();
    }

    findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    async findOneByEmailWithPassword(email: string): Promise<User | null> {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .addSelect('user.passwordHash')
            .getOne();
    }

    async create(userData: Partial<User>): Promise<User> {
        const newUser = this.usersRepository.create(userData);
        return this.usersRepository.save(newUser);
    }

    // --- ✨ تم إصلاح الدالة هنا ---
    async updateUserRestaurant(userId: number, restaurant: Restaurant): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id: userId });

        // ٢. التحقق مما إذا كان المستخدم موجوداً
        if (!user) {
            // ٣. إطلاق استثناء إذا لم يكن موجوداً
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        user.restaurant = restaurant;
        return this.usersRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async updatePassword(userId: number, hashedPassword: string): Promise<void> {
        await this.usersRepository.update(userId, { password: hashedPassword });
    }
}
