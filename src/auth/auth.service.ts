import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private restaurantsService: RestaurantsService,
    ) { }

    async register(registerDto: RegisterDto, files?: any) {
        const existingUser = await this.usersService.findOneByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('هذا البريد الإلكتروني مسجل مسبقاً.');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(registerDto.password, salt);

        const user = await this.usersService.create({
            fullName: registerDto.fullName,
            email: registerDto.email,
            passwordHash: hashedPassword,
        });

        const restaurant = await this.restaurantsService.create({
            name: registerDto.restaurantName,
            address: registerDto.address,
            cuisineType: registerDto.cuisineType,
            phoneNumber: registerDto.phoneNumber,
            owner: user,
            licenseFile: files?.licenseFile?.[0]?.filename,
            registryFile: files?.registryFile?.[0]?.filename,
        });

        user.restaurant = restaurant;
        await this.usersService.save(user);

        const { passwordHash, ...result } = user;
        return result;
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findOneByEmail(loginDto.email);
        if (!user || !user.passwordHash) {
            throw new Error('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return { message: 'Logged in successfully', email: user.email };
    }
}
