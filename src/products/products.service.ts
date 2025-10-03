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
    ): Promise<Product> {
        const restaurant = await this.restaurantRepository.findOne({
            where: { owner: { id: userId } },
        });

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found for the current user.');
        }

        const newProduct = this.productsRepository.create({
            ...createProductDto,
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
    ): Promise<Product> {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['restaurant', 'restaurant.owner'],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found.`);
        }

        if (product.restaurant.owner.id !== userId) {
            throw new UnauthorizedException(
                'You are not authorized to update this product.',
            );
        }

        Object.assign(product, updateProductDto);
        return this.productsRepository.save(product);
    }

    async remove(id: number, userId: number): Promise<void> {
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
        await this.productsRepository.delete(id);
    }
}
