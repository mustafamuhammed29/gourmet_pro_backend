import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Restaurant } from '../restaurants/restaurant.entity';

// هذا الملف يحتوي على المنطق البرمجي الفعلي لإدارة المنتجات
@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Restaurant)
        private restaurantsRepository: Repository<Restaurant>,
    ) { }

    /**
     * دالة لإنشاء منتج جديد وربطه بالمطعم الخاص بالمستخدم
     */
    async create(createProductDto: CreateProductDto, userId: string): Promise<Product> {
        const restaurant = await this.restaurantsRepository.findOne({
            where: { owner: { id: userId } },
        });

        if (!restaurant) {
            throw new NotFoundException(`لم يتم العثور على مطعم مرتبط بهذا المستخدم.`);
        }

        const newProduct = this.productsRepository.create({
            ...createProductDto,
            restaurant: restaurant,
        });

        return this.productsRepository.save(newProduct);
    }

    /**
     * دالة للعثور على جميع المنتجات الخاصة بمطعم معين
     */
    async findAllForRestaurant(userId: string): Promise<Product[]> {
        return this.productsRepository.find({
            where: {
                restaurant: {
                    owner: {
                        id: userId,
                    },
                },
            },
            relations: ['restaurant'], // Include restaurant relation if needed elsewhere
        });
    }

    /**
     * دالة لتعديل منتج موجود
     * @param id معرف المنتج المراد تعديله
     * @param updateProductDto البيانات الجديدة
     * @param userId معرف المستخدم للتأكد من الملكية
     */
    async update(id: string, updateProductDto: UpdateProductDto, userId: string): Promise<Product> {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['restaurant', 'restaurant.owner'], // جلب معلومات المطعم والمالك
        });

        if (!product) {
            throw new NotFoundException(`لم يتم العثور على منتج بالمعرف ${id}`);
        }

        // التحقق من أن المستخدم هو مالك المطعم الذي يتبعه هذا المنتج
        if (product.restaurant.owner.id !== userId) {
            throw new ForbiddenException('ليس لديك صلاحية لتعديل هذا المنتج.');
        }

        // دمج البيانات الجديدة مع القديمة وحفظها
        Object.assign(product, updateProductDto);
        return this.productsRepository.save(product);
    }

    /**
     * دالة لحذف منتج
     * @param id معرف المنتج المراد حذفه
     * @param userId معرف المستخدم للتأكد من الملكية
     */
    async remove(id: string, userId: string): Promise<void> {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['restaurant', 'restaurant.owner'],
        });

        if (!product) {
            throw new NotFoundException(`لم يتم العثور على منتج بالمعرف ${id}`);
        }

        if (product.restaurant.owner.id !== userId) {
            throw new ForbiddenException('ليس لديك صلاحية لحذف هذا المنتج.');
        }

        await this.productsRepository.remove(product);
    }
}

