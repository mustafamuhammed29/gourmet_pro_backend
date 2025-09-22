import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // ١. جعل خدمة المستخدمين متاحة للاستخدام من قبل الوحدات الأخرى
  exports: [UsersService],
})
export class UsersModule { }

