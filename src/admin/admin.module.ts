import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, User, Order, Product]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
