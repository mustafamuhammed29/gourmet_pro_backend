import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User, UserStatus } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private restaurantsService: RestaurantsService,
        private documentsService: DocumentsService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        if (user.status === UserStatus.PENDING) {
            return { status: 'pending' };
        }
        if (user.status === UserStatus.REJECTED) {
            return { status: 'rejected' };
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            status: 'approved',
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(
        registerDto: RegisterDto,
        licensePath: string,
        commercialRegistryPath: string,
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const newUser = await this.usersService.create({
            fullName: registerDto.fullName,
            email: registerDto.email,
            password: hashedPassword,
            phoneNumber: registerDto.phoneNumber,
        });

        const newRestaurant = await this.restaurantsService.create({
            name: registerDto.restaurantName,
            address: registerDto.address,
            cuisineType: registerDto.cuisineType,
            owner: newUser,
        });

        await this.usersService.updateUserRestaurant(newUser.id, newRestaurant);

        await this.documentsService.assignDocumentsToRestaurant(
            newRestaurant.id,
            licensePath,
            commercialRegistryPath,
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = newUser;
        return result as User;
    }
}

