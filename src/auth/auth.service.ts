import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User, UserStatus } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        //
        // --
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            // -- تم التعديل هنا --
            //
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
            ...registerDto,
            password: hashedPassword,
        });

        // لاحقًا، سنقوم بربط المستندات بالمطعم المرتبط بهذا المستخدم
        console.log('License Path:', licensePath);
        console.log('Commercial Registry Path:', commercialRegistryPath);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = newUser;
        return result as User;
    }
}

