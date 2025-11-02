import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';
import { LocalStrategy } from './guards/local.strategy';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { DocumentsModule } from '../documents/documents.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entities/password-reset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordReset]),
    UsersModule,
    RestaurantsModule,
    DocumentsModule,
    PassportModule,
    JwtModule.register({
      secret: 'gourmetProSecretKey2024',
      signOptions: { expiresIn: '1d' },
    }),
    // --- ✨ ٤. إضافة تهيئة Multer المتقدمة هنا ---
    MulterModule.register({
      storage: diskStorage({
        // ٤.أ: تحديد المجلد الذي سيتم حفظ الملفات فيه
        destination: './uploads',
        // ٤.ب: تحديد كيفية تسمية الملفات بشكل فريد
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          // بناء الاسم النهائي: original-name-timestamp.extension
          cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`);
        },
      }),
    }),
    // ------------------------------------
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule { }

