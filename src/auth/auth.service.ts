import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // ١. استيراد خدمة JWT
import { UsersService } from '../users/users.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
    // ٢. حقن (Inject) الخدمات التي نحتاجها
    constructor(
        private usersService: UsersService,
        private restaurantsService: RestaurantsService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findOneByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('هذا البريد الإلكتروني مسجل مسبقاً.');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(registerDto.password, salt);

        const newRestaurant = await this.restaurantsService.create({
            name: registerDto.restaurantName,
        });

        const user = await this.usersService.create({
            email: registerDto.email,
            passwordHash: hashedPassword,
            restaurant: newRestaurant,
        });

        return {
            message: 'تم إنشاء الحساب بنجاح!',
            userId: user.id,
            restaurantId: newRestaurant.id,
        };
    }

    // ٣. تعديل دالة تسجيل الدخول
    async login(loginDto: LoginDto): Promise<{ message: string, access_token: string }> {
        const user = await this.usersService.findOneByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('بيانات الدخول غير صحيحة.');
        }

        const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('بيانات الدخول غير صحيحة.');
        }

        // ٤. إنشاء "حمولة" البطاقة الرقمية
        const payload = { sub: user.id, email: user.email };

        // ٥. إنشاء وإرجاع بطاقة الهوية الرقمية (JWT)
        return {
            message: 'Login successful!',
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}

