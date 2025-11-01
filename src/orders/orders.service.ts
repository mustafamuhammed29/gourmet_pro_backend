import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Restaurant } from '../restaurants/restaurant.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<Order> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { owner: { id: userId } },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found for the current user.');
    }

    let product = null;
    if (createOrderDto.productId) {
      product = await this.productRepository.findOne({
        where: { id: createOrderDto.productId },
      });
    }

    const newOrder = this.orderRepository.create({
      dishName: createOrderDto.dishName,
      price: createOrderDto.price,
      notes: createOrderDto.notes,
      restaurant: restaurant,
      product: product,
    });

    return this.orderRepository.save(newOrder);
  }

  async findAllByRestaurant(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        restaurant: {
          owner: {
            id: userId,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    orderId: number,
    status: string,
    userId: number,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['restaurant', 'restaurant.owner'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.restaurant.owner.id !== userId) {
      throw new NotFoundException('Unauthorized');
    }

    order.status = status;
    return this.orderRepository.save(order);
  }
}
