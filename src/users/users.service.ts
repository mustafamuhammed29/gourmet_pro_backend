import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    // تم تعديل findOne ليستخدم createQueryBuilder لضمان التوافق مع UUID
    findOne(id: string): Promise<User | null> {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne();
    }

    findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    // Find a user by email and explicitly include the passwordHash
    async findOneByEmailWithPassword(email: string): Promise<User | null> {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .addSelect('user.passwordHash') // Explicitly select the hidden column
            .getOne();
    }

    // تم تعديل create لتكون أكثر وضوحًا وتتجنب أخطاء النوع
    async create(
        registerDto: RegisterDto & { password?: string },
    ): Promise<User> {
        const newUser = new User();
        newUser.fullName = registerDto.fullName;
        newUser.email = registerDto.email;
        newUser.password = registerDto.password;
        newUser.phoneNumber = registerDto.phoneNumber;

        return this.usersRepository.save(newUser);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}

