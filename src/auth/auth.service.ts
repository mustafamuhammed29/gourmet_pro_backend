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
        const hashedPassword = await bcrypt.hash(registerDto.password, 12);

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


  // Password Reset Methods
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset code has been sent' };
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expires in 1 hour

    // Save to database (you'll need to create PasswordReset entity)
    // await this.passwordResetRepository.save({ email, code, expiresAt });

    // TODO: Send email with code
    console.log(`Password reset code for ${email}: ${code}`);

    return { message: 'If the email exists, a reset code has been sent' };
  }

  async verifyResetCode(email: string, code: string): Promise<{ valid: boolean }> {
    // TODO: Verify code from database
    // const reset = await this.passwordResetRepository.findOne({ 
    //   where: { email, code, used: false } 
    // });
    
    // if (!reset || reset.expiresAt < new Date()) {
    //   return { valid: false };
    // }

    return { valid: true };
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    // Verify code
    const verification = await this.verifyResetCode(email, code);
    if (!verification.valid) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    // Update password
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await this.usersService.update(user.id, { password: hashedPassword });

    // Mark code as used
    // await this.passwordResetRepository.update({ email, code }, { used: true });

    return { message: 'Password reset successfully' };
  }
