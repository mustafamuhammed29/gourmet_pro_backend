import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'; // ١. استيراد وحدة JWT
import { UsersModule } from '../users/users.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/jwt.strategy';

@Module({
  // ٢. إضافة JwtModule إلى قائمة imports
  imports: [
    UsersModule,
    RestaurantsModule,
    PassportModule,
    JwtModule.register({
      global: true, // لجعل الوحدة متاحة في كل التطبيق
      secret: 'YOUR_SUPER_SECRET_KEY_GOES_HERE', // ٣. المفتاح السري
      signOptions: { expiresIn: '1d' }, // ٤. مدة صلاحية البطاقة (يوم واحد)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }

