import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { Restaurant } from '../restaurants/restaurant.entity'; // ١. استيراد كيان المطعم

@Module({
  // ٢. تسجيل الكيانات التي تحتاجها هذه الوحدة (Product و Restaurant)
  imports: [TypeOrmModule.forFeature([Product, Restaurant])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }

