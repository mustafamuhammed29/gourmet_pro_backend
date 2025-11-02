import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Restaurant } from '../restaurants/restaurant.entity';
import { unlink } from 'fs/promises'; // ✨ ١. استيراد دالة حذف الملفات

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Restaurant)
        private restaurantRepository: Repository<Restaurant>,
    ) { }

    async create(
        createProductDto: CreateProductDto,
        userId: number,
        imageUrl?: string, // ✨ ٢. استقبال مسار الصورة
    ): Promise<Product> {
        const restaurant = await this.restaurantRepository.findOne({
            where: { owner: { id: userId } },
        });

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found for the current user.');
        }

        const newProduct = this.productsRepository.create({
            ...createProductDto,
            imageUrl, // ✨ ٣. إضافة مسار الصورة هنا
            restaurant: restaurant,
        });

        return this.productsRepository.save(newProduct);
    }

    async findAll(userId: number): Promise<Product[]> {
        return this.productsRepository.find({
            where: {
                restaurant: {
                    owner: {
                        id: userId,
                    },
                },
            },
            relations: ['restaurant', 'restaurant.owner'],
        });
    }

    async findOne(id: number, userId: number): Promise<Product> {
        const product = await this.productsRepository.findOne({
            where: { id: id },
            relations: ['restaurant', 'restaurant.owner'],
        });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        if (product.restaurant.owner.id !== userId) {
            throw new UnauthorizedException();
        }
        return product;
    }

    async update(
        id: number,
        updateProductDto: UpdateProductDto,
        userId: number,
        imageUrl?: string, // ✨ ٤. استقبال مسار الصورة الجديد
    ): Promise<Product> {
        const product = await this.findOne(id, userId);
        const oldImagePath = product.imageUrl;

        // ✨ ٥. منطق حذف الصورة القديمة
        if (imageUrl && oldImagePath) {
            try {
                await unlink(oldImagePath); // حذف الملف القديم
            } catch (error) {
                console.error(`Failed to delete old image: ${oldImagePath}`, error);
            }
        }

        // دمج البيانات الجديدة مع البيانات الحالية
        const updatedData = {
            ...updateProductDto,
            ...(imageUrl && { imageUrl: imageUrl }), // إضافة الصورة الجديدة فقط إذا كانت موجودة
        };

        Object.assign(product, updatedData);
        return this.productsRepository.save(product);
    }

    async remove(id: number, userId: number): Promise<void> {
        const product = await this.findOne(id, userId);
        const imagePath = product.imageUrl;

        // ✨ ٦. حذف الصورة المرتبطة بالمنتج عند حذفه
        if (imagePath) {
            try {
                await unlink(imagePath);
            } catch (error) {
                console.error(`Failed to delete image: ${imagePath}`, error);
            }
        }
        await this.productsRepository.delete(id);
    }
}
