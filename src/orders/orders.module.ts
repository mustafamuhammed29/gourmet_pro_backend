import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { Product } from '../products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant, Product])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
